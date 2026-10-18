<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, loginFirstTime, requestPasswordReset } from '../data/authStore'
import { studentsList, getAvatarInitial } from '../data/studentsStore'
import { LogIn, KeyRound, User, ArrowRight, ShieldAlert, CheckCircle2, ChevronLeft } from '@lucide/vue'

const router = useRouter()
const step = ref('checkUsername') // 'checkUsername' | 'enterPassword' | 'setPassword' | 'forgotRequested'
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const studentObj = ref(null)

const handleNextStep = () => {
  if (!username.value) {
    errorMsg.value = 'กรุณากรอกชื่อผู้ใช้งาน'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  setTimeout(() => {
    if (username.value === 'boss' || username.value === 'ครูบอส') {
      step.value = 'enterPassword'
      isLoading.value = false
      return
    }

    const s = studentsList.value.find(st => st.studentId === username.value)
    if (s) {
      studentObj.value = s
      if (s.password) {
        step.value = 'enterPassword'
      } else {
        step.value = 'setPassword'
      }
    } else {
      errorMsg.value = 'ไม่พบรหัสนักศึกษาในระบบ'
    }
    isLoading.value = false
  }, 400)
}

const handleLoginSubmit = () => {
  if (!password.value) {
    errorMsg.value = 'กรุณากรอกรหัสผ่าน'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  setTimeout(async () => {
    const res = await login(username.value, password.value)
    if (res.success) {
      router.push('/')
    } else {
      errorMsg.value = res.message
    }
    isLoading.value = false
  }, 600)
}

const handleSetPasswordSubmit = () => {
  if (!password.value || password.value.length < 4) {
    errorMsg.value = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'รหัสผ่านที่ยืนยันไม่ตรงกัน'
    return
  }

  isLoading.value = true
  errorMsg.value = ''

  setTimeout(async () => {
    const res = await loginFirstTime(username.value, password.value)
    if (res.success) {
      router.push('/')
    } else {
      errorMsg.value = res.message
    }
    isLoading.value = false
  }, 600)
}

const handleForgotPassword = () => {
  requestPasswordReset(username.value)
  step.value = 'forgotRequested'
}

const goBack = () => {
  step.value = 'checkUsername'
  password.value = ''
  confirmPassword.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div
    class="min-h-screen bg-stone-100 flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
    <!-- Backdrop Blur -->
    <div class="absolute inset-0 bg-green-900/40 backdrop-blur-sm"></div>

    <div class="w-full max-w-md relative z-10">

      <!-- Login Card -->
      <div
        class="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 relative">

        <button v-if="step !== 'checkUsername' && step !== 'forgotRequested'" @click="goBack"
          class="absolute top-6 left-6 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer">
          <ChevronLeft class="w-5 h-5" />
        </button>

        <div class="p-8 sm:p-10">
          <div class="flex justify-center mb-6">
            <template v-if="!studentObj">
              <div
                class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden relative">
                <img src="/kruboss_logo.png" alt="Logo" class="w-full h-full object-cover relative z-10"
                  onerror="this.style.display='none'" />
                <User class="w-10 h-10 text-green-700 absolute z-0" />
              </div>
            </template>
            <template v-else>
              <div
                class="w-28 h-28 relative flex items-center justify-center transition-transform hover:scale-105 duration-300 drop-shadow-md">
                <!-- Avatar circle slightly smaller to fit inside frame -->
                <div
                  class="absolute inset-0 m-auto w-[76%] h-[76%] bg-emerald-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-emerald-200/50 shadow-inner z-0">
                  <span v-if="!studentObj.avatar" class="text-3xl font-black text-emerald-600">{{
                    getAvatarInitial(studentObj.name) }}</span>
                  <img v-else :src="studentObj.avatar" class="w-full h-full object-cover" />
                </div>
                <!-- Frame on top -->
                <img v-if="studentObj.equippedFrame" :src="studentObj.equippedFrame"
                  class="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
              </div>
            </template>
          </div>

          <div class="text-center mb-8">
            <h1 class="text-3xl font-black text-stone-800 mb-2">KruBoss</h1>
            <p class="text-sm font-bold text-green-600">Gamified Classroom System</p>
          </div>

          <!-- Step 1: Check Username -->
          <form v-if="step === 'checkUsername'" @submit.prevent="handleNextStep"
            class="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-stone-500 ml-1">ชื่อผู้ใช้งาน (รหัสนักศึกษา)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User class="h-5 w-5 text-stone-400" />
                </div>
                <input v-model="username" type="text"
                  class="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  placeholder="กรอกชื่อผู้ใช้งาน..." />
              </div>
            </div>

            <div v-if="errorMsg"
              class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-[shake_0.5s_ease-in-out]">
              <span class="text-lg leading-none">⚠️</span> {{ errorMsg }}
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm transition-all shadow-lg shadow-green-600/30 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100 cursor-pointer">
              <span v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                <span>ถัดไป</span>
                <ArrowRight class="w-4 h-4" />
              </template>
            </button>
          </form>

          <!-- Step 2: Enter Password -->
          <form v-else-if="step === 'enterPassword'" @submit.prevent="handleLoginSubmit"
            class="space-y-5 animate-[fadeIn_0.3s_ease-out]">
            <div class="text-center mb-4">
              <p class="text-stone-500 text-xs font-bold">ยินดีต้อนรับกลับมา,</p>
              <p class="text-stone-800 font-black text-lg">{{ studentObj ? studentObj.name : 'คุณครู' }}</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-stone-500 ml-1">รหัสผ่าน</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound class="h-5 w-5 text-stone-400" />
                </div>
                <input v-model="password" type="password"
                  class="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  placeholder="กรอกรหัสผ่านของคุณ..." />
              </div>
            </div>

            <div class="flex justify-end">
              <button v-if="username !== 'boss' && username !== 'ครูบอส'" type="button" @click="handleForgotPassword"
                class="text-[11px] font-bold text-stone-400 hover:text-green-600 cursor-pointer">
                ลืมรหัสผ่าน?
              </button>
            </div>

            <div v-if="errorMsg"
              class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-[shake_0.5s_ease-in-out]">
              <span class="text-lg leading-none">⚠️</span> {{ errorMsg }}
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black text-sm transition-all shadow-lg shadow-green-600/30 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100 cursor-pointer">
              <span v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                <LogIn class="w-5 h-5" /> <span>เข้าสู่ระบบ</span>
              </template>
            </button>
          </form>

          <!-- Step 3: Set Password (First time) -->
          <form v-else-if="step === 'setPassword'" @submit.prevent="handleSetPasswordSubmit"
            class="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div class="text-center mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p class="text-emerald-700 text-xs font-bold">สวัสดี {{ studentObj.name }}</p>
              <p class="text-emerald-600 text-[10px] mt-1">
                นี่เป็นการเข้าใช้งานครั้งแรกของคุณ<br />กรุณาตั้งรหัสผ่านเพื่อใช้ในการเข้าสู่ระบบครั้งต่อไป</p>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-stone-500 ml-1">ตั้งรหัสผ่านใหม่ (อย่างน้อย 4 ตัว)</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound class="h-4 w-4 text-stone-400" />
                </div>
                <input v-model="password" type="password"
                  class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  placeholder="รหัสผ่านใหม่" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-stone-500 ml-1">ยืนยันรหัสผ่านอีกครั้ง</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CheckCircle2 class="h-4 w-4 text-stone-400" />
                </div>
                <input v-model="confirmPassword" type="password"
                  class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  placeholder="ยืนยันรหัสผ่านใหม่" />
              </div>
            </div>

            <div v-if="errorMsg"
              class="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2 animate-[shake_0.5s_ease-in-out]">
              <span class="text-lg leading-none">⚠️</span> {{ errorMsg }}
            </div>

            <button type="submit" :disabled="isLoading"
              class="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm transition-all shadow-lg shadow-teal-600/30 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100 cursor-pointer mt-2">
              <span v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <template v-else>
                <LogIn class="w-5 h-5" /> <span>บันทึกและเข้าสู่ระบบ</span>
              </template>
            </button>
          </form>

          <!-- Step 4: Forgot Password Requested -->
          <div v-else-if="step === 'forgotRequested'" class="space-y-6 text-center animate-[fadeIn_0.3s_ease-out]">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-2">
              <ShieldAlert class="w-8 h-8" />
            </div>
            <h3 class="font-black text-lg text-stone-800">ส่งคำขอสำเร็จ</h3>
            <p class="text-sm text-stone-500 font-medium leading-relaxed">
              ระบบได้ส่งคำขอรีเซ็ตรหัสผ่านของ <br />
              <span class="text-blue-600 font-bold font-mono">{{ username }}</span> ไปยังครูบอสแล้ว<br />
              กรุณาแจ้งครูบอสเพื่อทำการอนุมัติ
            </p>

            <button @click="goBack"
              class="w-full py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-black text-sm transition-all cursor-pointer">
              กลับหน้าหลัก
            </button>
          </div>

        </div>

        <div class="bg-stone-50 p-5 text-center border-t border-stone-100">
          <p class="text-[11px] font-bold text-stone-400 leading-relaxed">
            นักศึกษาเข้าใช้งานครั้งแรก: ใช้ <span class="text-stone-600">รหัสนักศึกษา</span> เป็น Username
            เพื่อตั้งรหัสผ่าน
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
