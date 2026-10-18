<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  MessageSquare,
  Heart,
  Image as ImageIcon,
  Send,
  MoreHorizontal,
  Award,
  BookOpen,
  BadgeCheck,
  Target,
  Trash2,
  Edit,
  X
} from '@lucide/vue'
import { authUser, isLoggedIn } from '../data/authStore'
import { studentsList, isStudent, fetchStudents } from '../data/studentsStore'
import { questsList, fetchQuests, fetchQuestProgress, getStudentQuestCompletions } from '../data/questsStore'
import { directShopItems } from '../data/shopStore'
import AnnouncementModal from '../components/AnnouncementModal.vue'
import { API_BASE_URL } from '@/config/api'

const router = useRouter()

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  const id = (authUser.value?.studentId || authUser.value?.id || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r) || id === 'boss'
})

const currentUserId = computed(() => {
  return authUser.value?.studentId || authUser.value?.id || ''
})

const postImageInput = ref(null)
const selectedPostImageFile = ref(null)
const postImagePreview = ref('')
const activeFullImage = ref(null)

const triggerPostImageSelect = () => {
  postImageInput.value?.click()
}

const handlePostImageSelect = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
    return
  }
  selectedPostImageFile.value = file
  postImagePreview.value = URL.createObjectURL(file)
}

const removePostImage = () => {
  selectedPostImageFile.value = null
  postImagePreview.value = ''
  if (postImageInput.value) {
    postImageInput.value.value = ''
  }
}

const previewFullImage = (url) => {
  activeFullImage.value = url
}

const parsePostContent = (rawContent) => {
  if (!rawContent) return { text: '', image: null }
  const imgRegex = /\[image:(.*?)\]/
  const match = rawContent.match(imgRegex)
  const image = match ? match[1] : null
  const text = rawContent.replace(imgRegex, '').trim()
  return { text, image }
}

const newPostContent = ref('')
const posts = ref([])
const isLoadingPosts = ref(false)

const fetchPosts = async () => {
  isLoadingPosts.value = true
  try {
    const res = await fetch(`${API_BASE_URL}/posts`)
    if (res.ok) {
      const data = await res.json()
      const currentStudentId = authUser.value?.studentId || authUser.value?.id
      posts.value = data.map(p => {
        const { text, image } = parsePostContent(p.content)
        return {
          id: p.id,
          authorId: p.authorId,
          author: {
            name: p.author?.name || 'นิรนาม',
            role: p.author?.role || 'นักศึกษา',
            avatar: (p.author?.avatar && (p.author.avatar.includes('/') || p.author.avatar.includes('http') || p.author.avatar.startsWith('data:'))) ? p.author.avatar : '/placeholder_profile.png',
            frame: p.author?.equippedFrame || null
          },
          content: p.content,
          text,
          image,
          likes: p.likesCount || (Array.isArray(p.likes) ? p.likes.length : 0),
          comments: p.commentsCount || (Array.isArray(p.comments) ? p.comments.length : 0),
          timestamp: new Date(p.createdAt).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          isLiked: Array.isArray(p.likes) && p.likes.some(l => l.studentId === currentStudentId),
          showMenu: false,
          showComments: false,
          isEditing: false,
          editContent: text,
          newCommentText: '',
          commentsList: (p.comments || []).map(c => ({
            id: c.id,
            authorId: c.authorId,
            author: c.author?.name || 'นิรนาม',
            avatar: (c.author?.avatar && (c.author.avatar.includes('/') || c.author.avatar.includes('http') || c.author.avatar.startsWith('data:'))) ? c.author.avatar : '/placeholder_profile.png',
            text: c.content,
            timestamp: new Date(c.createdAt).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' }),
            showMenu: false
          }))
        }
      })
    }
  } catch (e) {
    console.error('Failed to fetch posts:', e)
  } finally {
    isLoadingPosts.value = false
  }
}

const topStudents = computed(() => {
  return (studentsList.value || [])
    .filter(s => isStudent(s))
    .slice()
    .sort((a, b) => (b.coins || 0) - (a.coins || 0))
    .slice(0, 3)
})

const interestingQuests = computed(() => {
  return (questsList.value || []).slice(0, 3)
})

const isQuestCompleted = (quest) => {
  const currentStudentId = authUser.value?.studentId || authUser.value?.id
  const completions = getStudentQuestCompletions(quest.id, currentStudentId)
  return quest.maxCompletions > 0 && completions >= quest.maxCompletions
}

const getQuestProgress = (quest) => {
  const currentStudentId = authUser.value?.studentId || authUser.value?.id
  const current = getStudentQuestCompletions(quest.id, currentStudentId)
  const max = quest.maxCompletions || 1
  const percent = Math.min(100, Math.round((current / max) * 100))
  return { current, max, percent }
}

const getRewardFrameImage = (itemId) => {
  const item = (directShopItems.value || []).find(i => i.id === itemId)
  return item?.image || '/img/frame/Cyber.png'
}

onMounted(() => {
  fetchPosts()
  fetchStudents()
  fetchQuests()
  const currentStudentId = authUser.value?.studentId || authUser.value?.id
  if (currentStudentId) {
    fetchQuestProgress(currentStudentId)
  }
})

const isPosting = ref(false)
const handlePost = async () => {
  if ((!newPostContent.value.trim() && !selectedPostImageFile.value) || !isLoggedIn.value || isPosting.value) return
  isPosting.value = true
  const authorId = authUser.value?.studentId || authUser.value?.id || 'boss'

  try {
    let uploadedImageUrl = null
    if (selectedPostImageFile.value) {
      const formData = new FormData()
      formData.append('file', selectedPostImageFile.value)
      const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      })
      if (!uploadRes.ok) {
        throw new Error('อัปโหลดรูปภาพไม่สำเร็จ')
      }
      const uploadData = await uploadRes.json()
      if (uploadData.success && uploadData.url) {
        uploadedImageUrl = uploadData.url
      } else {
        throw new Error(uploadData.message || 'อัปโหลดรูปภาพไม่สำเร็จ')
      }
    }

    let content = newPostContent.value.trim()
    if (uploadedImageUrl) {
      content = content ? `${content}\n[image:${uploadedImageUrl}]` : `[image:${uploadedImageUrl}]`
    }

    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId, content })
    })
    if (res.ok) {
      newPostContent.value = ''
      removePostImage()
      await fetchPosts()
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || 'ไม่สามารถโพสต์ได้ กรุณาลองใหม่อีกครั้ง')
    }
  } catch (e) {
    console.error('Failed to create post:', e)
    alert(e.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
  } finally {
    isPosting.value = false
  }
}

const toggleLike = async (post) => {
  const studentId = authUser.value?.studentId || authUser.value?.id
  if (!studentId) return

  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1

  try {
    await fetch(`${API_BASE_URL}/posts/${post.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    })
  } catch (e) {
    console.error('Failed to toggle like:', e)
  }
}

const deletePost = async (postId) => {
  posts.value = posts.value.filter(p => p.id !== postId)
  try {
    await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE'
    })
  } catch (e) {
    console.error('Failed to delete post:', e)
  }
}

const startEditPost = (post) => {
  post.editContent = post.text || post.content
  post.isEditing = true
  post.showMenu = false
}

const saveEditPost = async (post) => {
  if (post.editContent.trim()) {
    const newText = post.editContent.trim()
    const finalContent = post.image ? `${newText}\n[image:${post.image}]` : newText
    try {
      await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalContent })
      })
      post.content = finalContent
      post.text = newText
    } catch (e) {
      console.error('Failed to update post:', e)
    }
  }
  post.isEditing = false
}

const cancelEditPost = (post) => {
  post.isEditing = false
}

const submitComment = async (post) => {
  if (!post.newCommentText.trim() || !isLoggedIn.value) return
  const content = post.newCommentText.trim()
  const authorId = authUser.value?.studentId || authUser.value?.id

  try {
    const res = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId, content })
    })
    if (res.ok) {
      const newComment = await res.json()
      post.commentsList.push({
        id: newComment.id,
        authorId,
        author: authUser.value.name,
        avatar: (authUser.value.avatar && (authUser.value.avatar.includes('/') || authUser.value.avatar.includes('http') || authUser.value.avatar.startsWith('data:'))) ? authUser.value.avatar : '/placeholder_profile.png',
        text: content,
        timestamp: 'เมื่อสักครู่'
      })
      post.comments++
      post.newCommentText = ''
    }
  } catch (e) {
    console.error('Failed to submit comment:', e)
  }
}

const deleteComment = async (post, commentId) => {
  post.commentsList = post.commentsList.filter(c => c.id !== commentId)
  post.comments = Math.max(0, post.comments - 1)
  try {
    await fetch(`${API_BASE_URL}/posts/comments/${commentId}`, {
      method: 'DELETE'
    })
  } catch (e) {
    console.error('Failed to delete comment:', e)
  }
}
</script>

<template>
  <div class="space-y-10 animate-[fadeIn_0.35s_ease-out]">
    <AnnouncementModal />
    <!-- Elegant Redesigned Hero Section -->
    <div
      class="relative w-full h-[85vh] min-h-[600px] rounded-[3rem] bg-[#0c1f16] overflow-hidden flex flex-col items-center justify-center shadow-2xl border border-emerald-900/50 mb-12">
      <!-- Subtle Ambient Glow -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none">
      </div>
      <div
        class="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none">
      </div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none">
      </div>

      <!-- Minimal Top Navigation Area -->
      <div
        class="absolute top-0 inset-x-0 p-8 flex justify-between items-center text-emerald-200/50 text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase z-20">
        <span>Kmutnb / Info Tech</span>
        <span>Semester 2 / 2026</span>
        <span>KruBoss</span>
      </div>

      <!-- Central Floating Images -->
      <div class="relative w-full max-w-3xl h-64 md:h-80 flex items-center justify-center z-10 mb-8 md:mb-12"
        style="perspective: 1000px;">
        <!-- Image 1 -->
        <img src="/Me.png" alt="Kru Phachara"
          class="absolute w-56 md:w-72 h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-105 hover:z-30 -translate-x-24 md:-translate-x-32 rotate-[-4deg] animate-[kruFloat_6s_ease-in-out_infinite]" />
        <!-- Image 2 -->
        <img src="/Me2.png" alt="Kru Phachara"
          class="absolute w-64 md:w-80 h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-105 hover:z-30 translate-x-24 md:translate-x-32 translate-y-10 md:translate-y-16 rotate-[3deg] animate-[kruFloatRev_7s_ease-in-out_infinite]" />
      </div>

      <!-- Huge Handwriting Typography -->
      <h1
        class="relative z-20 font-['Caveat'] text-7xl md:text-9xl lg:text-[130px] text-emerald-50 font-black tracking-tight leading-[0.85] text-center drop-shadow-2xl">
        Welcome to<br />
        <span class="text-emerald-400">KruBoss</span> Classroom
      </h1>

      <!-- Subtle bottom text / CTA -->
      <div class="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center space-y-3 z-20">
        <p class="text-emerald-300/60 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase">
          Explore Your Journey
        </p>
        <button @click="router.push('/courses')"
          class="w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer animate-bounce">
          <ArrowRight class="w-5 h-5 rotate-90" />
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-10 gap-8 w-full pb-12">

      <!-- Community Feed Section (70%) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Create Post Card -->
        <div v-if="isLoggedIn" class="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/50">
          <div class="flex gap-4">
            <div class="relative w-12 h-12 rounded-2xl shrink-0">
              <img v-if="authUser.equippedFrame" :src="authUser.equippedFrame"
                class="absolute inset-0 w-full h-full object-cover z-10 scale-125 pointer-events-none drop-shadow-sm" />
              <div class="w-full h-full rounded-xl overflow-hidden bg-gray-100">
                <img :src="(authUser.avatar && (authUser.avatar.includes('/') || authUser.avatar.includes('http') || authUser.avatar.startsWith('data:'))) ? authUser.avatar : '/placeholder_profile.png'"
                  class="w-full h-full object-cover" @error="$event.target.src = '/placeholder_profile.png'" />
              </div>
            </div>
            <div class="flex-1 space-y-3">
              <textarea v-model="newPostContent" rows="3"
                class="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
                placeholder="แบ่งปันความคิดเห็น, ถามคำถาม, หรืออวดกรอบรูปใหม่..."></textarea>

              <!-- Image Preview Before Post -->
              <div v-if="postImagePreview" class="relative inline-block">
                <img :src="postImagePreview" class="w-32 h-32 object-cover rounded-2xl border border-emerald-200 shadow-sm" />
                <button type="button" @click="removePostImage"
                  class="absolute -top-2 -right-2 bg-stone-900/80 hover:bg-stone-900 text-white p-1 rounded-full shadow-md transition-colors cursor-pointer"
                  title="ลบรูปภาพ">
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <div class="flex items-center justify-between pt-1">
                <input type="file" ref="postImageInput" accept="image/*" class="hidden" @change="handlePostImageSelect" />
                <button type="button" @click="triggerPostImageSelect"
                  class="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  :class="postImagePreview ? 'text-emerald-600 bg-emerald-50' : ''"
                  title="แนบรูปภาพ">
                  <ImageIcon class="w-5 h-5" />
                  <span v-if="postImagePreview" class="text-[11px]">เลือกรูปแล้ว</span>
                </button>
                <button @click="handlePost" :disabled="(!newPostContent.trim() && !postImagePreview) || isPosting"
                  class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition-all cursor-pointer">
                  <span>{{ isPosting ? 'กำลังโพสต์...' : 'โพสต์' }}</span>
                  <Send class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feed List -->
        <div class="space-y-6">
          <div v-for="post in posts" :key="post.id"
            class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
            <!-- Post Header -->
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div class="relative w-14 h-14 rounded-2xl shrink-0 mt-1">
                  <img v-if="post.author.frame" :src="post.author.frame"
                    class="absolute inset-0 w-full h-full object-cover z-10 scale-125 pointer-events-none drop-shadow-md" />
                  <div class="w-full h-full rounded-2xl overflow-hidden bg-gray-100">
                    <img :src="post.author.avatar || '/placeholder_profile.png'" class="w-full h-full object-cover" @error="$event.target.src = '/placeholder_profile.png'" />
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-gray-900">{{ post.author.name }}</h4>
                    <span v-if="post.author.role === 'teacher'"
                      class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                      ผู้สอน
                    </span>
                  </div>
                  <p class="text-xs text-gray-400 mt-0.5">{{ post.timestamp }}</p>
                </div>
              </div>
              <!-- Post 3-Dots Menu -->
              <div class="relative" v-if="isTeacher || post.authorId === currentUserId">
                <button @click="post.showMenu = !post.showMenu"
                  class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <MoreHorizontal class="w-5 h-5" />
                </button>

                <!-- Dropdown Menu -->
                <div v-if="post.showMenu"
                  class="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-[fadeIn_0.2s_ease-out]">
                  <button v-if="post.authorId === currentUserId" @click="startEditPost(post)"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer">
                    <Edit class="w-4 h-4" />
                    แก้ไขโพสต์
                  </button>
                  <button @click="deletePost(post.id)"
                    class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer">
                    <Trash2 class="w-4 h-4" />
                    ลบโพสต์
                  </button>
                </div>
              </div>
            </div>

            <!-- Post Content -->
            <div v-if="post.isEditing" class="mb-5 pl-2 animate-[fadeIn_0.2s_ease-out]">
              <textarea v-model="post.editContent" rows="3"
                class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"></textarea>
              <div class="flex justify-end gap-2 mt-2">
                <button @click="cancelEditPost(post)"
                  class="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">ยกเลิก</button>
                <button @click="saveEditPost(post)"
                  class="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer">บันทึก</button>
              </div>
            </div>
            <div v-else class="mb-5 pl-2 space-y-3">
              <p v-if="post.text" class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {{ post.text }}
              </p>
              <div v-if="post.image" class="mt-2">
                <img :src="post.image"
                  class="rounded-2xl max-h-[420px] w-auto max-w-full object-cover border border-gray-100 shadow-sm cursor-pointer hover:brightness-95 transition-all"
                  @click="previewFullImage(post.image)"
                  title="คลิกเพื่อดูรูปภาพขนาดเต็ม" />
              </div>
            </div>

            <!-- Post Actions -->
            <div class="flex items-center gap-6 pt-4 border-t border-gray-50">
              <button @click="toggleLike(post)"
                class="flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
                :class="post.isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'">
                <Heart class="w-5 h-5 transition-transform" :class="post.isLiked ? 'fill-current scale-110' : ''" />
                <span>{{ post.likes }}</span>
              </button>
              <button @click="post.showComments = !post.showComments"
                class="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer">
                <MessageSquare class="w-5 h-5" />
                <span>{{ post.comments }}</span>
              </button>
            </div>

            <!-- Comments Section -->
            <div v-if="post.showComments"
              class="mt-4 pt-4 border-t border-gray-50 space-y-4 animate-[fadeIn_0.2s_ease-out]">

              <!-- Comment List -->
              <div v-for="comment in post.commentsList" :key="comment.id" class="flex gap-3 group/comment items-start">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-0.5">
                  <img :src="comment.avatar || '/placeholder_profile.png'" class="w-full h-full object-cover" @error="$event.target.src = '/placeholder_profile.png'" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <!-- Comment Bubble -->
                    <div class="bg-gray-50/80 rounded-2xl px-3.5 py-2 border border-gray-100 inline-block max-w-[85%]">
                      <span class="text-xs font-bold text-gray-900 block mb-0.5">{{ comment.author }}</span>
                      <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-line break-words">{{ comment.text }}</p>
                    </div>

                    <!-- 3-Dots Menu Button (Far right of comment) -->
                    <div class="relative shrink-0" v-if="isTeacher || comment.authorId === currentUserId">
                      <button @click="comment.showMenu = !comment.showMenu"
                        class="opacity-0 group-hover/comment:opacity-100 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                        title="ตัวเลือก">
                        <MoreHorizontal class="w-4 h-4" />
                      </button>

                      <!-- Dropdown Menu -->
                      <div v-if="comment.showMenu"
                        class="absolute right-0 top-6 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30 animate-[fadeIn_0.15s_ease-out]">
                        <button @click="comment.showMenu = false; deleteComment(post, comment.id)"
                          class="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer">
                          <Trash2 class="w-3.5 h-3.5" />
                          <span>ลบคอมเมนต์</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="px-2 mt-1">
                    <span class="text-[10px] text-gray-400">{{ comment.timestamp }}</span>
                  </div>
                </div>
              </div>

              <!-- Add Comment Input -->
              <div class="flex gap-3 items-center mt-2" v-if="isLoggedIn">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img :src="(authUser.avatar && (authUser.avatar.includes('/') || authUser.avatar.includes('http') || authUser.avatar.startsWith('data:'))) ? authUser.avatar : '/placeholder_profile.png'"
                    class="w-full h-full object-cover" @error="$event.target.src = '/placeholder_profile.png'" />
                </div>
                <div class="flex-1 relative">
                  <input v-model="post.newCommentText" @keyup.enter="submitComment(post)" type="text"
                    class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-10"
                    placeholder="แสดงความคิดเห็น..." />
                  <button @click="submitComment(post)" :disabled="!post.newCommentText.trim()"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-50 p-1 rounded-lg transition-colors cursor-pointer">
                    <Send class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div> <!-- End Feed Col -->

      <!-- Right Sidebar / Widgets (30%) -->
      <div class="lg:col-span-3 space-y-6">

        <!-- Widget 1: System Announcements & Leaderboard -->
        <div
          class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden group">
          <div
            class="absolute -top-6 -right-6 p-4 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
            <Award class="w-32 h-32" />
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-1">
              <Award class="w-5 h-5 text-emerald-600" />
              <h3 class="text-emerald-900 font-black text-lg">ท็อปแรงค์สัปดาห์นี้</h3>
            </div>
            <p class="text-emerald-700/70 text-[11px] font-bold mb-4">จัดอันดับนักศึกษาที่สะสมเหรียญมากที่สุด 3
              อันดับแรก</p>

            <div class="space-y-2.5">
              <div v-for="(student, index) in topStudents" :key="student.studentId || student.id"
                class="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-xl font-black w-5 text-center drop-shadow-sm shrink-0"
                    :class="index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-400' : 'text-amber-700/80'">
                    {{ index + 1 }}
                  </span>
                  <div class="relative w-9 h-9 rounded-xl shrink-0">
                    <img v-if="student.equippedFrame" :src="student.equippedFrame"
                      class="absolute inset-0 w-full h-full object-cover z-10 scale-125 pointer-events-none drop-shadow-sm" />
                    <div class="w-full h-full rounded-xl overflow-hidden bg-gray-200"
                      :class="index === 0 ? 'ring-2 ring-amber-400' : index === 1 ? 'ring-2 ring-gray-300' : 'ring-2 ring-amber-700/40'">
                      <img
                        :src="(student.avatar && (student.avatar.includes('/') || student.avatar.includes('http') || student.avatar.startsWith('data:'))) ? student.avatar : '/placeholder_profile.png'"
                        class="w-full h-full object-cover" @error="$event.target.src = '/placeholder_profile.png'" />
                    </div>
                  </div>
                  <div class="truncate min-w-0">
                    <span class="text-sm font-bold text-gray-800 truncate block">{{ student.name }}</span>
                    <span class="text-[10px] text-gray-400 font-medium">รหัส : {{ student.studentId }}</span>
                  </div>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-lg shrink-0">
                  {{ student.coins || 0 }} 🪙
                </span>
              </div>
              <div v-if="topStudents.length === 0" class="text-center py-4 text-xs text-stone-400 font-medium">
                ยังไม่มีข้อมูลนักศึกษาในระบบ
              </div>
            </div>
          </div>
        </div>

        <!-- Widget 2: Weekly Quests Hint -->
        <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group overflow-hidden">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">🎯</span>
            <h3 class="text-gray-900 font-black text-lg">ภารกิจน่าสนใจ</h3>
          </div>
          <p class="text-gray-500 text-[11px] font-bold mb-5">ทำภารกิจเพื่อรับเหรียญและไอเทมพิเศษ</p>

          <div class="space-y-3 relative z-10">
            <div v-for="quest in interestingQuests" :key="quest.id" @click="router.push('/quests')"
              class="rounded-[1rem] p-2.5 transition-transform hover:-translate-y-0.5 cursor-pointer border"
              :class="isQuestCompleted(quest) ? 'bg-[#e5f4d3] border-[#e5f4d3]' : 'bg-white shadow-sm border-indigo-100 hover:border-indigo-300'">

              <!-- Completed Quest Style -->
              <div v-if="isQuestCompleted(quest)" class="flex items-center gap-3">
                <div class="shrink-0 flex items-center justify-center text-[#55b359]">
                  <BadgeCheck class="w-7 h-7" fill="currentColor" stroke="#e5f4d3" stroke-width="2" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-black text-[13px] text-[#469e4a] drop-shadow-sm truncate">{{ quest.title }}</h4>
                  <p class="text-[10px] text-emerald-700/80 truncate">สำเร็จเรียบร้อยแล้ว</p>
                </div>
              </div>

              <!-- In-progress Quest Style -->
              <div v-else class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-indigo-100 text-indigo-500">
                  <Target class="w-5 h-5" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-black text-xs text-stone-800 truncate mb-1.5">{{ quest.title }}</h4>
                  <div
                    class="flex items-center gap-2 bg-stone-50 px-2 py-1 rounded-full border border-stone-200/60 max-w-[120px]">
                    <span class="text-[9px] font-black text-stone-600 shrink-0 w-6">
                      {{ getQuestProgress(quest).current }} / {{ getQuestProgress(quest).max }}
                    </span>
                    <div class="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-400 rounded-full"
                        :style="{ width: `${getQuestProgress(quest).percent}%` }"></div>
                    </div>
                  </div>
                </div>
                <!-- Rewards Preview -->
                <div class="flex flex-row items-center gap-1.5 shrink-0">
                  <div v-for="(rew, rIdx) in (quest.rewards || []).slice(0, 2)" :key="rIdx"
                    class="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-lg w-8 h-8 shadow-sm">
                    <span v-if="rew.type === 'coin'" class="text-sm leading-none -mt-0.5">🪙</span>
                    <img v-else-if="rew.type === 'frame'" :src="getRewardFrameImage(rew.itemId)"
                      class="w-3.5 h-3.5 object-contain" onerror="this.style.display='none'" />
                    <span v-else class="text-xs leading-none">🎁</span>
                    <span class="text-[7px] font-black text-stone-600 mt-0.5">
                      {{ rew.type === 'coin' ? `x${rew.amount}` : 'x1' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="interestingQuests.length === 0" class="text-center py-4 text-xs text-stone-400 font-medium">
              ยังไม่มีภารกิจในระบบ
            </div>
          </div>

          <button @click="router.push('/quests')"
            class="w-full mt-6 py-3 bg-gray-50 hover:bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-gray-100 shadow-xs">
            ดูภารกิจทั้งหมด
          </button>
        </div>

      </div> <!-- End Sidebar Col -->
    </div> <!-- End Main Content Grid -->

    <!-- Full Image Preview Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="activeFullImage"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
          @click="activeFullImage = null">
          <div class="relative max-w-4xl max-h-[90vh] flex items-center justify-center" @click.stop>
            <button @click="activeFullImage = null"
              class="absolute -top-10 right-0 text-white/80 hover:text-white p-1 transition-colors cursor-pointer"
              title="ปิด">
              <X class="w-6 h-6" />
            </button>
            <img :src="activeFullImage" class="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');

@keyframes kruFloat {
  0% {
    transform: translateY(0px) translateX(-6rem) rotate(-4deg);
  }

  50% {
    transform: translateY(-15px) translateX(-6rem) rotate(-2deg);
  }

  100% {
    transform: translateY(0px) translateX(-6rem) rotate(-4deg);
  }
}

@keyframes kruFloatRev {
  0% {
    transform: translateY(2.5rem) translateX(6rem) rotate(3deg);
  }

  50% {
    transform: translateY(4rem) translateX(6rem) rotate(1deg);
  }

  100% {
    transform: translateY(2.5rem) translateX(6rem) rotate(3deg);
  }
}
</style>
