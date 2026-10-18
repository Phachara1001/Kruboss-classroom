<script setup>
// src/components/MemberCard.vue
import { computed } from 'vue'
import { Crown, Shield, Pencil, Lock } from '@lucide/vue'

const props = defineProps({
    student: { type: Object, required: true },
    variant: { type: String, default: 'student' }, // 'president' | 'vice' | 'student'
    rank: { type: Object, default: null },
    canEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['view', 'edit'])

const avatarSrc = computed(() => {
    const a = props.student.avatar
    if (!a || typeof a !== 'string') return '/placeholder_profile.png'
    const trimmed = a.trim()
    if (!trimmed || trimmed === '-' || trimmed.length <= 2) return '/placeholder_profile.png'
    if (trimmed.startsWith('data:') || trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed
    if (trimmed.includes('localhost')) return `http://${trimmed}`
    if (trimmed.includes('/')) return trimmed
    return '/placeholder_profile.png'
})

const fallbackText = computed(() => props.student.avatar || (props.student.name || '?').trim().charAt(0))
const isRanked = computed(() => {
    if (!props.rank) return false
    if (props.rank.id === 'unranked') return false
    if (props.rank.name === 'Unranked' || props.rank.grade === '0' || props.rank.rankNumber === 8) return false
    return true
})
const hasNick = computed(() => props.student.nickname && props.student.nickname !== '-')

const configs = {
    president: {
        card: 'w-full max-w-xs p-6 pt-7 rounded-[2rem] bg-gradient-to-b from-amber-50 via-white to-white border border-amber-300 shadow-[0_20px_40px_-20px_rgba(217,119,6,0.55)]',
        avatar: 'w-24 h-24',
        ring: 'ring-4 ring-amber-300',
        avatarBg: 'bg-amber-100 text-amber-700 text-4xl',
        name: 'text-lg group-hover:text-amber-700',
        link: 'text-amber-800',
        divider: 'border-amber-100'
    },
    vice: {
        card: 'w-64 p-5 rounded-3xl bg-white border border-sky-200 shadow-[0_16px_30px_-20px_rgba(2,132,199,0.55)]',
        avatar: 'w-[4.5rem] h-[4.5rem]',
        ring: 'ring-[3px] ring-sky-300',
        avatarBg: 'bg-sky-50 text-sky-700 text-2xl',
        name: 'text-base group-hover:text-sky-700',
        link: 'text-sky-700',
        divider: 'border-sky-100'
    },
    student: {
        // "ใบไม้": สองมุมโค้งมาก สองมุมแหลม
        card: 'p-4 rounded-tl-lg rounded-br-lg rounded-tr-[2rem] rounded-bl-[2rem] bg-white border border-emerald-100 shadow-[0_12px_24px_-18px_rgba(5,150,105,0.6)] hover:border-emerald-400',
        avatar: 'w-16 h-16',
        ring: 'ring-2 ring-emerald-200',
        avatarBg: 'bg-emerald-50 text-emerald-800 text-xl',
        name: 'text-sm group-hover:text-emerald-700',
        link: 'text-stone-600 hover:text-emerald-700',
        divider: 'border-stone-100'
    }
}

const cfg = computed(() => configs[props.variant] || configs.student)
</script>

<template>
    <article :class="[
        'group relative flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1',
        cfg.card
    ]">
        <!-- Quick edit -->
        <button v-if="canEdit" type="button" title="แก้ไขข้อมูล"
            class="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-white/80 border border-stone-200 text-stone-400 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500"
            @click.stop="emit('edit', student)">
            <Pencil class="w-3.5 h-3.5" />
        </button>

        <!-- Avatar + name (opens profile) -->
        <button type="button"
            class="flex flex-col items-center w-full cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
            @click="emit('view', student)">
            <div class="relative mb-3" :class="[cfg.avatar, variant === 'president' ? 'mt-3' : '']">
                <!-- Crown for president -->
                <div v-if="variant === 'president'"
                    class="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-9 h-9 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-md ring-4 ring-white">
                    <Crown class="w-5 h-5" />
                </div>

                <img v-if="student.equippedFrame" :src="student.equippedFrame" alt=""
                    class="absolute inset-[-15%] w-[130%] h-[130%] max-w-none pointer-events-none drop-shadow-md z-10" />
                <div
                    :class="['w-full h-full rounded-full overflow-hidden flex items-center justify-center font-black border-2 border-white', cfg.ring, cfg.avatarBg]">
                    <img :src="avatarSrc" :alt="student.name"
                        class="w-full h-full object-cover object-top"
                        @error="$event.target.src = '/placeholder_profile.png'" />
                </div>

                <!-- Rank badge on avatar (student leaf) -->
                <div v-if="variant === 'student'" :title="isRanked ? (rank?.name || 'Ranked') : 'Unranked'"
                    class="absolute -bottom-1 -right-1 z-20 w-6 h-6 rounded-full bg-stone-900 border-2 border-white flex items-center justify-center p-0.5 shadow-xs">
                    <img v-if="isRanked && (rank?.badgeImg || rank?.logo)" :src="rank.badgeImg || rank.logo"
                        :alt="rank.name" class="w-full h-full object-contain" />
                    <Lock v-else class="w-3 h-3 text-stone-400" />
                </div>
            </div>

            <h4 :class="['font-bold text-stone-900 leading-snug transition-colors line-clamp-1 w-full', cfg.name]">
                {{ student.name }}
            </h4>
            <p v-if="hasNick" class="text-xs text-stone-500">({{ student.nickname }})</p>
            <p v-else-if="variant === 'student'" class="text-[11px] text-stone-400 italic">(ยังไม่ระบุชื่อเล่น)</p>
            <p class="text-[11px] font-mono text-stone-400 mt-0.5">{{ student.studentId }}</p>
        </button>

        <!-- Role + rank (president / vice) -->
        <div v-if="variant !== 'student'" class="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span :class="[
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
                variant === 'president' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
            ]">
                <Crown v-if="variant === 'president'" class="w-3 h-3" />
                <Shield v-else class="w-3 h-3" />
                {{ student.role }}
            </span>

            <span v-if="isRanked"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[11px] font-bold">
                <img :src="rank.logo" alt="" class="w-3.5 h-3.5 object-contain" />
                {{ rank.name }}
            </span>
            <span v-else
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-300 text-[11px] font-bold border border-stone-800 shadow-xs">
                <Lock class="w-3 h-3 text-stone-400" /> Unranked
            </span>
        </div>

        <!-- Student rank badge -->
        <div v-else class="mt-1 flex items-center justify-center">
            <span v-if="isRanked"
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 text-white text-[10px] sm:text-[11px] font-bold">
                <img v-if="rank?.badgeImg || rank?.logo" :src="rank.badgeImg || rank.logo" alt=""
                    class="w-3.5 h-3.5 object-contain" />
                {{ rank.name }}
            </span>
            <span v-else
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-300 text-[10px] sm:text-[11px] font-bold border border-stone-800 shadow-xs">
                <Lock class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400" /> Unranked
            </span>
        </div>

        <p v-if="student.quote" :class="[
            'italic text-stone-500 text-center line-clamp-2',
            variant === 'student' ? 'text-[11px] mt-2 px-1' : 'text-xs mt-3 px-2'
        ]">
            “{{ student.quote }}”
        </p>

        <!-- Footer -->
        <div
            :class="['w-full mt-auto pt-3 border-t flex items-center justify-between text-xs', cfg.divider, variant === 'student' ? 'mt-3' : 'mt-4']">
            <button type="button" :class="['font-bold hover:underline cursor-pointer', cfg.link]"
                @click="emit('view', student)">
                ดูโปรไฟล์
            </button>
            <button v-if="canEdit" type="button"
                class="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                @click="emit('edit', student)">
                <Pencil class="w-3 h-3" /> แก้ไข
            </button>
        </div>
    </article>
</template>