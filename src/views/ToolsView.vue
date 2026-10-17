<script setup>
import { ref, computed } from 'vue'
import { Download, ExternalLink, Database, Server, PenTool, Braces, Terminal, ChevronLeft, Wrench } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { courses } from '../data/courses'

const route = useRoute()
const router = useRouter()

const course = computed(() => courses.find(c => c.id === route.params.id) || courses[0])

const databaseTools = [
  {
    title: 'ส่วนที่ 1: การออกแบบและเตรียมความพร้อม (สัปดาห์ที่ 1-2)',
    description: 'เครื่องมือสำหรับการเตรียมตัวเขียนโค้ดและออกแบบสถาปัตยกรรมฐานข้อมูลก่อนลงมือสร้างจริง',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    tools: [
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'โปรแกรม Editor สำหรับเขียนโค้ดที่ได้รับความนิยมสูงสุด เบาและเร็ว ใช้สำหรับเขียนคำสั่ง SQL หรือตรวจสอบไฟล์โครงสร้างข้อมูลแบบ JSON นอกจากนี้ยังสามารถลงส่วนเสริม (Extension) เพื่อจำลองการเชื่อมต่อฐานข้อมูลได้ด้วย',
        icon: Terminal,
        color: 'bg-blue-600',
        link: 'https://code.visualstudio.com/',
        type: 'Code Editor'
      },
      {
        id: 'drawio',
        name: 'Draw.io',
        description: 'เครื่องมือสร้างแผนภาพ (Diagram) บนเว็บไซต์ที่ใช้งานได้ฟรีและดีที่สุด ใช้สำหรับออกแบบ Entity-Relationship Diagram (ER-Diagram) เพื่อวางโครงสร้างฐานข้อมูลเชิงสัมพันธ์ก่อนนำไปสร้างตารางจริง',
        icon: PenTool,
        color: 'bg-yellow-600',
        link: 'https://app.diagrams.net/',
        type: 'Design Tool (Web)'
      }
    ]
  },
  {
    title: 'ส่วนที่ 2: ฐานข้อมูลเชิงสัมพันธ์ Relational Database (สัปดาห์ที่ 3-11)',
    description: 'ชุดโปรแกรมหลักสำหรับการเรียนการสอนภาษา SQL, การสร้าง View, Stored Procedure, และ Transaction',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    tools: [
      {
        id: 'xampp',
        name: 'XAMPP',
        description: 'โปรแกรมจำลองเซิร์ฟเวอร์แบบออฟไลน์ที่ติดตั้งง่ายที่สุด ภายในจะมาพร้อมกับฐานข้อมูล MySQL/MariaDB ใช้เป็นเซิร์ฟเวอร์หลักตลอดการเรียนในครึ่งเทอมแรก ให้นักศึกษาประมวลผลคำสั่ง SQL ได้โดยไม่ต้องต่ออินเทอร์เน็ต',
        icon: Server,
        color: 'bg-orange-500',
        link: 'https://www.apachefriends.org/index.html',
        type: 'Relational DB Server'
      },
      {
        id: 'dbeaver',
        name: 'DBeaver (Community)',
        description: 'โปรแกรมจัดการฐานข้อมูล (Database GUI Tool) ระดับมืออาชีพ ทำหน้าที่เชื่อมต่อไปยัง XAMPP เพื่อแสดงผลตารางข้อมูลแบบกราฟิกสวยงาม ช่วยให้นักศึกษาเขียนโค้ด SQL ได้ง่ายขึ้น มีระบบช่วยเติมคำ (Auto-complete)',
        icon: Database,
        color: 'bg-indigo-600',
        link: 'https://dbeaver.io/download/',
        type: 'Database Client / GUI'
      }
    ]
  },
  {
    title: 'ส่วนที่ 3: ฐานข้อมูล NoSQL และสมัยใหม่ (สัปดาห์ที่ 12-14)',
    description: 'เครื่องมือสำหรับการจัดการข้อมูลที่ไม่มีโครงสร้างตายตัว (Schema-less) และฐานข้อมูลยุคใหม่บนคลาวด์',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    tools: [
      {
        id: 'mongodb',
        name: 'MongoDB Compass',
        description: 'โปรแกรม GUI สำหรับจัดการฐานข้อมูลแบบ NoSQL (Document) ของ MongoDB โดยเฉพาะ ช่วยให้นักศึกษาสามารถดูโครงสร้างข้อมูลแบบ JSON ซ้อนทับกัน (Nested) และทดลองดึงข้อมูลด้วย Query Language ของ MongoDB ได้ง่ายๆ',
        icon: Braces,
        color: 'bg-emerald-600',
        link: 'https://www.mongodb.com/products/tools/compass',
        type: 'NoSQL Database GUI'
      }
    ]
  }
]

const platformTools = [
  {
    title: 'ส่วนที่ 1: เครื่องมือพื้นฐานและการจัดการเวอร์ชัน (สัปดาห์ที่ 1-8)',
    description: 'โปรแกรมสำหรับการเขียนโค้ดและระบบควบคุมเวอร์ชันเพื่อใช้ในการทำงานร่วมกัน',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    tools: [
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'โปรแกรม Editor ยอดนิยมสำหรับการเขียนโค้ด พร้อมส่วนเสริม (Extensions) สำหรับการทำงานกับ Git, Docker และแพลตฟอร์มอื่นๆ',
        icon: Terminal,
        color: 'bg-indigo-600',
        link: 'https://code.visualstudio.com/',
        type: 'Code Editor'
      },
      {
        id: 'git',
        name: 'Git',
        description: 'ระบบควบคุมเวอร์ชัน (Version Control System) เพื่อบันทึกประวัติการเปลี่ยนแปลงโค้ดและช่วยให้ทำงานร่วมกันได้อย่างมีประสิทธิภาพ',
        icon: Server,
        color: 'bg-orange-600',
        link: 'https://git-scm.com/downloads',
        type: 'Version Control'
      }
    ]
  },
  {
    title: 'ส่วนที่ 2: เครื่องมือสำหรับจัดการสภาพแวดล้อม (สัปดาห์ที่ 9-18)',
    description: 'โปรแกรมสำหรับการจำลองสภาพแวดล้อมในการรันระบบให้เหมือนกันในทุกเครื่อง',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    tools: [
      {
        id: 'docker',
        name: 'Docker Desktop',
        description: 'เครื่องมือสำหรับการสร้างและรันคอนเทนเนอร์ (Containers) ช่วยขจัดปัญหา "เครื่องฉันรันได้ ทำไมเซิร์ฟเวอร์รันไม่ได้"',
        icon: Database,
        color: 'bg-cyan-600',
        link: 'https://www.docker.com/products/docker-desktop/',
        type: 'Container Platform'
      }
    ]
  }
]

const ooadTools = [
  {
    title: 'ส่วนที่ 1: การออกแบบและจำลองแผนภาพ UML (สัปดาห์ที่ 4-15)',
    description: 'เครื่องมือสำหรับการเขียนแบบจำลองมาตรฐาน UML เช่น Use Case, Class Diagram, Activity Diagram และ Sequence Diagram',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    tools: [
      {
        id: 'drawio',
        name: 'Draw.io (diagrams.net)',
        description: 'เครื่องมือวาดแผนภาพออนไลน์ที่ครบครัน มีสัญลักษณ์มาตรฐาน UML ครบทุกแบบ ใช้งานง่ายและส่งออกไฟล์ได้หลากหลายรูปแบบ',
        icon: PenTool,
        color: 'bg-purple-600',
        link: 'https://app.diagrams.net/',
        type: 'UML Diagramming (Web)'
      },
      {
        id: 'plantuml',
        name: 'PlantUML / VS Code Extension',
        description: 'เครื่องมือสร้างไดอะแกรม UML จากการพิมพ์โค้ดคำอธิบายแบบข้อความ (Text-to-Diagram) สะดวกและเป็นมาตรฐานที่นักพัฒนามืออาชีพนิยมใช้',
        icon: Terminal,
        color: 'bg-violet-600',
        link: 'https://plantuml.com/',
        type: 'Modeling as Code'
      }
    ]
  },
  {
    title: 'ส่วนที่ 2: การสำรวจความต้องการและการระดมสมอง (สัปดาห์ที่ 1-3)',
    description: 'เครื่องมือสำหรับการรวบรวม Requirement จากผู้ใช้งาน และการออกแบบจัดระเบียบความคิดเชิงธุรกิจ',
    color: 'text-fuchsia-700',
    bg: 'bg-fuchsia-50',
    tools: [
      {
        id: 'miro',
        name: 'Miro / Whiteboard',
        description: 'กระดานไวท์บอร์ดออนไลน์สำหรับทำงานร่วมกัน ใช้ในการระดมความคิด วิเคราะห์ปัญหา และออกแบบ User Flow ร่วมกับทีมงาน',
        icon: PenTool,
        color: 'bg-amber-500',
        link: 'https://miro.com/',
        type: 'Brainstorming & Collaboration'
      }
    ]
  }
]

const currentTools = computed(() => {
  if (course.value.id === '31901-2007') return databaseTools
  if (course.value.id === '21901-2012') return platformTools
  return ooadTools
})
</script>

<template>
  <div class="space-y-8 animate-[fadeIn_0.3s_ease-out] pb-10">
    <div>
      <button @click="router.push(`/course/${course.id}`)" class="flex items-center text-sm font-bold mb-4 hover:underline" :class="course.theme.bgText">
        <ChevronLeft class="w-4 h-4 mr-1" /> กลับไปหน้ารายวิชา
      </button>
    </div>

    <!-- Header -->
    <div :class="['rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden', course.theme.titleBg]">
      <div class="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div class="relative z-10">
        <h1 class="text-3xl md:text-4xl font-black mb-4 flex items-center gap-3">
          <span>เครื่องมือที่ใช้ในการเรียน</span>
          <Wrench class="w-8 h-8 opacity-80" />
        </h1>
        <p class="text-white/80 text-lg max-w-2xl">
          รวบรวมโปรแกรมและเครื่องมือสำคัญที่จำเป็นสำหรับการเรียนในรายวิชา {{ course.name }}
          โดยเรียงลำดับตามเนื้อหาการเรียนการสอนจากต้นจนจบเทอม
        </p>
      </div>
    </div>

    <!-- Sections -->
    <div class="space-y-12">
      <div v-for="(section, index) in currentTools" :key="index" class="space-y-6">
        <!-- Section Header -->
        <div class="border-l-4 border-current pl-4" :class="section.color">
          <h2 class="text-2xl font-black mb-2">{{ section.title }}</h2>
          <p class="text-gray-600 font-medium">{{ section.description }}</p>
        </div>

        <!-- Tools Grid for this section -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div v-for="tool in section.tools" :key="tool.id" 
            class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden">
            
            <!-- Hover background effect -->
            <div class="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500" :class="tool.color"></div>

            <div class="flex items-start gap-4 mb-4 relative z-10">
              <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0', tool.color]">
                <component :is="tool.icon" class="w-8 h-8" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{{ tool.name }}</h3>
                <span class="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
                  {{ tool.type }}
                </span>
              </div>
            </div>
            
            <p class="text-gray-600 mb-8 flex-1 relative z-10 leading-relaxed text-sm md:text-base">
              {{ tool.description }}
            </p>

            <a :href="tool.link" target="_blank" rel="noopener noreferrer" 
              class="mt-auto w-full py-3 px-4 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-700 font-bold rounded-xl border border-gray-200 hover:border-green-200 transition-all flex items-center justify-center gap-2 group/btn relative z-10">
              <Download class="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
              ดาวน์โหลด / ใช้งาน
              <ExternalLink class="w-4 h-4 opacity-50 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions Box -->
    <div v-if="course.id === '31901-2007'" class="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-sm mt-8">
      <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="font-black text-xl">i</span>
      </div>
      <div>
        <h4 class="font-bold text-blue-900 text-lg mb-2">ข้อแนะนำสำหรับการติดตั้ง</h4>
        <p class="text-blue-800/80 leading-relaxed">
          ให้นักศึกษาดาวน์โหลดและติดตั้งเครื่องมือใน <strong>ส่วนที่ 1 และ 2 (VS Code, XAMPP, DBeaver)</strong> ให้เรียบร้อยก่อนสัปดาห์ที่ 2 เพื่อเตรียมความพร้อมสำหรับการปฏิบัติการเขียนคำสั่ง SQL พื้นฐาน ส่วน MongoDB ในส่วนที่ 3 สามารถติดตั้งภายหลังในช่วงครึ่งเทอมหลังได้
        </p>
      </div>
    </div>
    <div v-else class="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-sm mt-8">
      <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="font-black text-xl">i</span>
      </div>
      <div>
        <h4 class="font-bold text-indigo-900 text-lg mb-2">ข้อแนะนำสำหรับการติดตั้ง</h4>
        <p class="text-indigo-800/80 leading-relaxed">
          ในครึ่งเทอมแรกนักศึกษาจะต้องติดตั้ง <strong>VS Code และ Git</strong> ไว้ให้พร้อมใช้งานสำหรับการทำงานร่วมกันผ่าน Git & GitHub ส่วน <strong>Docker Desktop</strong> จะเริ่มใช้ในครึ่งเทอมหลัง
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
