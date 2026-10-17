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
  Edit
} from '@lucide/vue'
import { authUser, isLoggedIn } from '../data/authStore'
import AnnouncementModal from '../components/AnnouncementModal.vue'
import { API_BASE_URL } from '@/config/api'

const router = useRouter()

const isTeacher = computed(() => {
  const r = (authUser.value?.role || '').toLowerCase()
  return ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(r)
})

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
      posts.value = data.map(p => ({
        id: p.id,
        authorId: p.authorId,
        author: {
          name: p.author?.name || 'นิรนาม',
          role: p.author?.role || 'นักศึกษา',
          avatar: p.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.authorId}`,
          frame: p.author?.equippedFrame || null
        },
        content: p.content,
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
        editContent: '',
        newCommentText: '',
        commentsList: (p.comments || []).map(c => ({
          id: c.id,
          authorId: c.authorId,
          author: c.author?.name || 'นิรนาม',
          avatar: c.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.authorId}`,
          text: c.content,
          timestamp: new Date(c.createdAt).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }))
      }))
    }
  } catch (e) {
    console.error('Failed to fetch posts:', e)
  } finally {
    isLoadingPosts.value = false
  }
}

onMounted(() => {
  fetchPosts()
})

const handlePost = async () => {
  if (!newPostContent.value.trim() || !isLoggedIn.value) return
  const content = newPostContent.value.trim()
  const authorId = authUser.value?.studentId || authUser.value?.id

  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId, content })
    })
    if (res.ok) {
      newPostContent.value = ''
      await fetchPosts()
    }
  } catch (e) {
    console.error('Failed to create post:', e)
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
  post.editContent = post.content
  post.isEditing = true
  post.showMenu = false
}

const saveEditPost = async (post) => {
  if (post.editContent.trim()) {
    post.content = post.editContent.trim()
    try {
      await fetch(`${API_BASE_URL}/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: post.content })
      })
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
        avatar: authUser.value.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.value.id}`,
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
                <img :src="authUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`"
                  class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex-1 space-y-3">
              <textarea v-model="newPostContent" rows="3"
                class="w-full bg-gray-50/50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all"
                placeholder="แบ่งปันความคิดเห็น, ถามคำถาม, หรืออวดกรอบรูปใหม่..."></textarea>
              <div class="flex items-center justify-between">
                <button
                  class="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer">
                  <ImageIcon class="w-5 h-5" />
                </button>
                <button @click="handlePost" :disabled="!newPostContent.trim()"
                  class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-sm hover:shadow flex items-center gap-2 transition-all cursor-pointer">
                  <span>โพสต์</span>
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
                    <img :src="post.author.avatar" class="w-full h-full object-cover" />
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
              <div class="relative" v-if="post.author.name === authUser?.name || authUser?.role === 'teacher'">
                <button @click="post.showMenu = !post.showMenu"
                  class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <MoreHorizontal class="w-5 h-5" />
                </button>

                <!-- Dropdown Menu -->
                <div v-if="post.showMenu"
                  class="absolute right-0 top-8 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 animate-[fadeIn_0.2s_ease-out]">
                  <button @click="startEditPost(post)"
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
            <p v-else class="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-5 pl-2">
              {{ post.content }}
            </p>

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
              <div v-for="comment in post.commentsList" :key="comment.id" class="flex gap-3 group/comment">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img :src="comment.avatar" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <div class="bg-gray-50/80 rounded-2xl px-3 py-2 border border-gray-100 inline-block max-w-full">
                    <div class="flex items-center justify-between mb-0.5 gap-3">
                      <span class="text-xs font-bold text-gray-900">{{ comment.author }}</span>
                      <button
                        v-if="isTeacher || comment.authorId === (authUser?.studentId || authUser?.id) || post.authorId === (authUser?.studentId || authUser?.id)"
                        @click="deleteComment(post, comment.id)"
                        class="opacity-0 group-hover/comment:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-0.5 rounded cursor-pointer"
                        title="ลบคอมเมนต์"
                      >
                        <Trash2 class="w-3 h-3" />
                      </button>
                    </div>
                    <p class="text-xs text-gray-700 leading-relaxed">{{ comment.text }}</p>
                  </div>
                  <div class="px-2 mt-1">
                    <span class="text-[10px] text-gray-400">{{ comment.timestamp }}</span>
                  </div>
                </div>
              </div>

              <!-- Add Comment Input -->
              <div class="flex gap-3 items-center mt-2" v-if="isLoggedIn">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <img :src="authUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.id}`"
                    class="w-full h-full object-cover" />
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
              <div
                class="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-black text-amber-500 w-5 text-center drop-shadow-sm">1</span>
                  <div class="w-9 h-9 rounded-xl bg-gray-200 overflow-hidden shrink-0 ring-2 ring-amber-400">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-bold text-gray-800">สมชาย ใจดี</span>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-lg">850 🪙</span>
              </div>
              <div
                class="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-black text-gray-400 w-5 text-center drop-shadow-sm">2</span>
                  <div class="w-9 h-9 rounded-xl bg-gray-200 overflow-hidden shrink-0 ring-2 ring-gray-300">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-bold text-gray-800">สมศรี รักเรียน</span>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-lg">720 🪙</span>
              </div>
              <div
                class="flex items-center justify-between bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div class="flex items-center gap-3">
                  <span class="text-xl font-black text-amber-700/80 w-5 text-center drop-shadow-sm">3</span>
                  <div class="w-9 h-9 rounded-xl bg-gray-200 overflow-hidden shrink-0 ring-2 ring-amber-700/40">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=C" class="w-full h-full object-cover" />
                  </div>
                  <span class="text-sm font-bold text-gray-800">มานะ อดทน</span>
                </div>
                <span class="text-xs font-black text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-lg">600 🪙</span>
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
            <!-- Completed Quest -->
            <div
              class="rounded-[1rem] p-2.5 bg-[#e5f4d3] border border-[#e5f4d3] flex items-center gap-3 transition-transform hover:-translate-y-0.5 cursor-pointer">
              <div class="shrink-0 flex items-center justify-center text-[#55b359]">
                <BadgeCheck class="w-7 h-7" fill="currentColor" stroke="#e5f4d3" stroke-width="2" />
              </div>
              <h4 class="font-black text-[13px] text-[#469e4a] drop-shadow-sm">ทักทายกันคาบแรก</h4>
            </div>

            <!-- In-progress Quest -->
            <div
              class="rounded-[1rem] p-2.5 bg-white shadow-sm border border-indigo-100 flex items-center gap-3 transition-transform hover:-translate-y-0.5 cursor-pointer hover:border-indigo-300">
              <!-- Left -->
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner bg-indigo-100 text-indigo-500">
                <Target class="w-5 h-5" />
              </div>
              <!-- Middle -->
              <div class="flex-1 min-w-0">
                <h4 class="font-black text-xs text-stone-800 truncate mb-1.5">ส่งมอบหลักฐานการเข้าเรียน</h4>
                <div
                  class="flex items-center gap-2 bg-stone-50 px-2 py-1 rounded-full border border-stone-200/60 max-w-[120px]">
                  <span class="text-[9px] font-black text-stone-600 shrink-0 w-6">1 / 10</span>
                  <div class="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div class="h-full bg-amber-400 w-[10%] rounded-full"></div>
                  </div>
                </div>
              </div>
              <!-- Right (Rewards) -->
              <div class="flex flex-row items-center gap-1.5 shrink-0">
                <div
                  class="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-lg w-8 h-8 shadow-sm">
                  <span class="text-sm leading-none -mt-0.5">🪙</span>
                  <span class="text-[7px] font-black text-stone-600 mt-0.5">x50</span>
                </div>
                <div
                  class="flex flex-col items-center justify-center bg-stone-50 border border-stone-200 rounded-lg w-8 h-8 shadow-sm">
                  <img :src="'/img/frame/Cyber.png'" class="w-3.5 h-3.5 object-contain"
                    onerror="this.style.display='none'" />
                  <span class="text-[7px] font-black text-stone-600 mt-0.5">x1</span>
                </div>
              </div>
            </div>
          </div>

          <button @click="router.push('/quests')"
            class="w-full mt-6 py-3 bg-gray-50 hover:bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-gray-100 shadow-xs">
            ดูภารกิจทั้งหมด
          </button>
        </div>

      </div> <!-- End Sidebar Col -->
    </div> <!-- End Main Content Grid -->

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
