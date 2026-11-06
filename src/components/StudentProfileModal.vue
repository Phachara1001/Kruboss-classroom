<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { X, ShieldCheck, Shield, GraduationCap, Phone, Lock, Pencil, Copy, Check, ChevronRight } from '@lucide/vue'
import StudentAvatar from './StudentAvatar.vue'
import { authUser } from '../data/authStore'
import { isTeacherUser } from '../data/studentsStore'
import { getStudentRank, unrankedTier } from '../data/rankConfig'
import { getStudentFullScore } from '../data/gradesStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  student: { type: Object, default: null },
  courseId: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'edit', 'close'])

const isTeacher = computed(() => isTeacherUser(authUser.value))

const canEdit = computed(() => {
  if (!props.student) return false
  if (isTeacher.value) return true
  const myId = authUser.value?.studentId || authUser.value?.id
  return !!(myId && myId === props.student.studentId)
})

const rankTier = computed(() => {
  if (!props.student?.studentId || !props.courseId) return unrankedTier
  const scoreData = getStudentFullScore(props.courseId, props.student.studentId)
  return getStudentRank(scoreData.totalScore)
})

// ---- Role theme (full class names so Tailwind can see them) ----
const roleThemes = {
  'หัวหน้าห้อง': {
    bar: 'bg-amber-400',
    chip: 'bg-amber-400/15 text-amber-200 ring-amber-400/40',
    quote: 'border-amber-400',
    icon: ShieldCheck
  },
  'รองหัวหน้าห้อง': {
    bar: 'bg-sky-400',
    chip: 'bg-sky-400/15 text-sky-200 ring-sky-400/40',
    quote: 'border-sky-400',
    icon: Shield
  },
  default: {
    bar: 'bg-emerald-400',
    chip: 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/40',
    quote: 'border-emerald-400',
    icon: null
  }
}
const theme = computed(() => roleThemes[props.student?.role] || roleThemes.default)

const classroomLabel = computed(() => {
  const c = props.student?.classroom
  if (!c) return ''
  return c === 'teacher_room' ? 'อาจารย์ผู้สอน' : `ห้อง ${c}`
})

// ---- Contacts ----
const fbPath =
  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
const igPath =
  'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'

const contacts = computed(() => {
  const s = props.student || {}
  const ig = s.ig ? (s.ig.startsWith('@') ? s.ig : `@${s.ig}`) : ''
  return [
    {
      key: 'phone',
      label: 'โทรศัพท์',
      value: s.phone,
      href: s.phone ? `tel:${s.phone}` : '',
      external: false,
      iconBox: 'bg-green-100 text-green-700'
    },
    {
      key: 'facebook',
      label: 'Facebook',
      value: s.facebook,
      href: s.facebook
        ? s.facebookUrl || `https://facebook.com/search/top?q=${encodeURIComponent(s.facebook)}`
        : '',
      external: true,
      iconBox: 'bg-blue-100 text-blue-700',
      path: fbPath
    },
    {
      key: 'instagram',
      label: 'Instagram',
      value: ig,
      href: s.ig ? s.igUrl || `https://instagram.com/${s.ig.replace(/^@/, '')}` : '',
      external: true,
      iconBox: 'bg-pink-100 text-pink-700',
      path: igPath
    }
  ]
})

// ---- Copy helper ----
const copiedKey = ref('')
let copyTimer = null
const copyText = async (key, text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copiedKey.value = ''), 1600)
  } catch (e) {
    /* clipboard unavailable — ignore */
  }
}

// ---- Close / Edit ----
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
const handleEdit = () => emit('edit', props.student)

const onKey = (e) => {
  if (e.key === 'Escape' && props.modelValue) handleClose()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  clearTimeout(copyTimer)
})
watch(
  () => props.modelValue,
  (open) => {
    if (!open) copiedKey.value = ''
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="profile">
      <div v-if="modelValue && student" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
        role="dialog" aria-modal="true" :aria-label="`โปรไฟล์ ${student.name}`">
        <!-- Backdrop -->
        <div class="profile-backdrop absolute inset-0 bg-stone-950/70 backdrop-blur-sm" @click="handleClose"></div>

        <!-- Card: stacked on mobile (bottom sheet), two columns from md -->
        <div
          class="profile-card relative z-10 w-full sm:max-w-xl md:max-w-3xl max-h-[94vh] flex bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden">
          <button @click="handleClose" aria-label="ปิด"
            class="absolute top-3 right-3 z-20 p-2 rounded-full text-white bg-stone-900/80 hover:bg-stone-900 ring-1 ring-white/20 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900">
            <X class="w-4 h-4" />
          </button>

          <div class="w-full overflow-y-auto grid md:grid-cols-[17rem_1fr]">
            <!-- Identity panel -->
            <aside class="relative bg-stone-900 text-white px-8 pt-14 pb-10 md:px-8 md:py-14"
              style="background-image: radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px); background-size: 14px 14px;">
              <!-- Lanyard slot -->
              <div
                class="absolute left-1/2 top-3 -translate-x-1/2 w-14 h-2 rounded-full bg-black/70 ring-1 ring-white/10">
              </div>
              <!-- Role accent: bottom edge on mobile, right edge on desktop -->
              <div
                :class="['absolute left-0 bottom-0 h-1.5 w-full md:left-auto md:top-0 md:right-0 md:h-auto md:w-1.5', theme.bar]">
              </div>

              <div class="flex flex-col items-center gap-6 text-center">
                <div class="p-3">
                  <StudentAvatar :avatar="student.avatar" :frame="student.equippedFrame" :name="student.name"
                    size="w-28 h-28 md:w-32 md:h-32" class="shrink-0"
                    borderClass="border-4 border-stone-700 shadow-lg" />
                </div>
                <div class="min-w-0">
                  <h3 class="font-black text-2xl leading-snug break-words">{{ student.name }}</h3>
                  <p class="text-sm text-stone-400">
                    {{ student.nickname && student.nickname !== '-' ? `ชื่อเล่น ${student.nickname}` :
                    'ยังไม่ได้ระบุชื่อเล่น' }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-center gap-2 mt-8">
                <span
                  :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1', theme.chip]">
                  <component :is="theme.icon" v-if="theme.icon" class="w-3.5 h-3.5" />
                  {{ student.role || 'นักศึกษา' }}
                </span>
                <span v-if="classroomLabel"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-stone-300 bg-white/10 ring-1 ring-white/15">
                  {{ classroomLabel }}
                </span>
              </div>

              <p v-if="student.quote"
                :class="['mt-8 pt-6 border-t-2 text-center text-sm italic text-stone-300 leading-relaxed', theme.quote]">
                {{ student.quote }}
              </p>
            </aside>

            <!-- Details panel -->
            <section class="p-8 md:p-10 md:pt-16 space-y-6 min-w-0">
              <!-- Rank plate (the one bold moment) -->
              <div
                class="relative overflow-hidden rounded-2xl bg-stone-950 text-white p-4 md:p-5 flex items-center gap-4">
                <div class="absolute -left-6 -top-6 w-36 h-36 rounded-full bg-white/10 blur-2xl pointer-events-none">
                </div>
                <div
                  class="relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center p-2">
                  <img v-if="rankTier.id !== 'unranked'" :src="rankTier.logo" :alt="rankTier.name"
                    class="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.35)]" />
                  <Lock v-else class="w-6 h-6 text-stone-400" />
                </div>
                <div class="relative min-w-0">
                  <p class="text-xs text-stone-400 font-medium">แรงค์ประจำวิชา</p>
                  <p class="font-black text-lg md:text-2xl leading-tight truncate">{{ rankTier.name }}</p>
                  <p v-if="rankTier.nameTh" class="text-sm text-stone-300">{{ rankTier.nameTh }}</p>
                </div>
              </div>

              <!-- Student ID -->
              <div class="flex items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3">
                <div class="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
                  <GraduationCap class="w-5 h-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs text-stone-400">รหัสนักศึกษา</p>
                  <p class="font-mono font-bold text-stone-900 tracking-wide">{{ student.studentId }}</p>
                </div>
                <button @click="copyText('id', student.studentId)" aria-label="คัดลอกรหัสนักศึกษา"
                  class="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer">
                  <Check v-if="copiedKey === 'id'" class="w-4 h-4 text-emerald-600" />
                  <Copy v-else class="w-4 h-4" />
                </button>
              </div>

              <!-- Contacts -->
              <div class="rounded-2xl border border-stone-200 divide-y divide-stone-200 overflow-hidden">
                <template v-for="c in contacts" :key="c.key">
                  <component :is="c.value ? 'a' : 'div'" :href="c.value ? c.href : undefined"
                    :target="c.value && c.external ? '_blank' : undefined"
                    :rel="c.value && c.external ? 'noopener' : undefined"
                    :class="['flex items-center gap-3 px-4 py-3 transition-colors', c.value ? 'hover:bg-stone-50 cursor-pointer' : '']">
                    <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', c.iconBox]">
                      <Phone v-if="c.key === 'phone'" class="w-4 h-4" />
                      <svg v-else class="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path :d="c.path" />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-xs text-stone-400">{{ c.label }}</p>
                      <p v-if="c.value" class="font-bold text-sm text-stone-900 truncate">{{ c.value }}</p>
                      <p v-else class="text-sm text-stone-400">ยังไม่ได้ระบุ</p>
                    </div>
                    <ChevronRight v-if="c.value" class="w-4 h-4 text-stone-300 shrink-0" />
                  </component>
                </template>
              </div>

              <!-- Edit -->
              <button v-if="canEdit" @click="handleEdit"
                class="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900">
                <Pencil class="w-4 h-4" />
                {{ isTeacher ? 'แก้ไขข้อมูลนักศึกษา' : 'แก้ไขโปรไฟล์ของฉัน' }}
              </button>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.profile-enter-active,
.profile-leave-active {
  transition: opacity 0.2s ease;
}

.profile-enter-from,
.profile-leave-to {
  opacity: 0;
}

.profile-enter-active .profile-card,
.profile-leave-active .profile-card {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.profile-enter-from .profile-card,
.profile-leave-to .profile-card {
  transform: translateY(28px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {

  .profile-enter-active,
  .profile-leave-active,
  .profile-enter-active .profile-card,
  .profile-leave-active .profile-card {
    transition: none;
  }
}
</style>