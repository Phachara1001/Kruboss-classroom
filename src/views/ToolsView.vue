<script setup>
import { ref, computed } from 'vue'
import { Download, ExternalLink, Database, Server, PenTool, Braces, Terminal, ChevronLeft, Wrench, Cloud, Globe } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { courses } from '../data/courses'

const route = useRoute()
const router = useRouter()

const course = computed(() => courses.find(c => c.id === route.params.id) || courses[0])

const databaseTools = [
  {
    title: 'ส่วนที่ 1: แพลตฟอร์มคลาวด์และการออกแบบ (Cloud Platform & Design)',
    description: 'แพลตฟอร์มฐานข้อมูลหลักและเครื่องมือออกแบบสถาปัตยกรรมโครงสร้างข้อมูล',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    tools: [
      {
        id: 'supabase',
        name: 'Supabase (Cloud Database)',
        description: 'แพลตฟอร์มระบบจัดการฐานข้อมูลระดับ Enterprise (ขับเคลื่อนด้วย PostgreSQL 100%) บนระบบคลาวด์ พร้อมระบบ Table Editor, SQL Editor, ระบบรักษาความปลอดภัย RLS, Storage และ Auto-generated REST APIs โดยเข้าใช้งานผ่านเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้งโปรแกรมในเครื่อง',
        icon: Cloud,
        color: 'bg-emerald-600',
        link: 'https://supabase.com/',
        type: 'Cloud PostgreSQL / BaaS'
      },
      {
        id: 'drawio',
        name: 'Draw.io',
        description: 'เครื่องมือสร้างแผนภาพ (Diagram) บนเว็บไซต์ ใช้งานได้ฟรีและสะดวก ใช้สำหรับออกแบบ Entity-Relationship Diagram (ER-Diagram) และ Relational Schema เพื่อวางโครงสร้างความสัมพันธ์ของตารางก่อนนำไปสร้างจริง',
        icon: PenTool,
        color: 'bg-amber-600',
        link: 'https://app.diagrams.net/',
        type: 'Design Tool (Web)'
      },
      {
        id: 'vscode',
        name: 'Visual Studio Code',
        description: 'โปรแกรม Code Editor ยอดนิยมอันดับหนึ่ง น้ำหนักเบาและมีความคล่องตัวสูง ใช้สำหรับเขียนสคริปต์ SQL (.sql), ไฟล์โครงสร้างข้อมูล JSON รวมถึงโค้ดเชื่อมต่อฐานข้อมูลสำหรับโครงงานปลายภาค',
        icon: Terminal,
        color: 'bg-blue-600',
        link: 'https://code.visualstudio.com/',
        type: 'Code Editor'
      }
    ]
  },
  {
    title: 'ส่วนที่ 2: เครื่องมือเชื่อมต่อฐานข้อมูลเชิงสัมพันธ์ (Database Client & Management)',
    description: 'ชุดโปรแกรมระดับมืออาชีพสำหรับเขียนและประมวลผลคำสั่งภาษา SQL, View, Stored Procedure และ Transaction',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    tools: [
      {
        id: 'dbeaver',
        name: 'DBeaver (Community Edition)',
        description: 'สุดยอดโปรแกรมจัดการฐานข้อมูล (Universal Database Tool) แบบ GUI ระดับมืออาชีพ สามารถเชื่อมต่อตรง (Direct Connection) ไปยังฐานข้อมูล PostgreSQL บน Supabase เพื่อฝึกเขียนคำสั่ง SQL, วิเคราะห์ Execution Plan, รันสคริปต์ และดูแผนผัง ERD อัตโนมัติ',
        icon: Database,
        color: 'bg-indigo-600',
        link: 'https://dbeaver.io/download/',
        type: 'Universal DB Client'
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL & pgAdmin',
        description: 'ระบบจัดการฐานข้อมูลเชิงสัมพันธ์แบบโอเพนซอร์สที่ทรงพลังที่สุดในโลก สำหรับใช้ศึกษาโครงสร้างการทำงานคำสั่ง SQL มาตรฐาน, Storage Engine, ACID Transaction และการบริหารจัดการฐานข้อมูลระดับ Server',
        icon: Server,
        color: 'bg-sky-700',
        link: 'https://www.postgresql.org/download/',
        type: 'Enterprise RDBMS'
      }
    ]
  },
  {
    title: 'ส่วนที่ 3: ฐานข้อมูล NoSQL และการทดสอบเชื่อมต่อสมัยใหม่ (NoSQL & Modern APIs)',
    description: 'เครื่องมือสำหรับจัดการข้อมูลแบบกึ่งโครงสร้าง (Document/JSON) และการทดสอบเชื่อมต่อฐานข้อมูลผ่าน Web API',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    tools: [
      {
        id: 'mongodb',
        name: 'MongoDB Compass',
        description: 'โปรแกรม GUI สำหรับจัดการฐานข้อมูลแบบ NoSQL (Document Store) ช่วยให้นักศึกษาเข้าใจโครงสร้างข้อมูล BSON/JSON และเปรียบเทียบความแตกต่างระหว่าง Relational กับ NoSQL ได้อย่างชัดเจน',
        icon: Braces,
        color: 'bg-emerald-600',
        link: 'https://www.mongodb.com/products/tools/compass',
        type: 'NoSQL Database GUI'
      },
      {
        id: 'postman',
        name: 'Postman (หรือ Thunder Client)',
        description: 'เครื่องมือทดสอบส่งคำขอ Web API (REST API) ใช้ทดสอบดึงข้อมูล (GET), เพิ่มข้อมูล (POST), อัปเดต (PATCH) และลบข้อมูล (DELETE) กับฐานข้อมูลคลาวด์ Supabase โดยตรงเสมือนการพัฒนาแอปพลิเคชันจริง',
        icon: Globe,
        color: 'bg-orange-600',
        link: 'https://www.postman.com/downloads/',
        type: 'API Client & Testing'
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
    <div v-if="course.id === '31901-2007'" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-sm mt-8">
      <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="font-black text-xl">i</span>
      </div>
      <div>
        <h4 class="font-bold text-emerald-900 text-lg mb-2">ข้อแนะนำสำหรับการเรียนการสอน</h4>
        <p class="text-emerald-800/80 leading-relaxed text-sm sm:text-base">
          ให้นักศึกษาสมัครบัญชี <strong>Supabase (supabase.com)</strong> โดยใช้บัญชี Google หรือ GitHub เพื่อเตรียมความพร้อมสำหรับสร้างและบริหารจัดการฐานข้อมูล PostgreSQL บนระบบคลาวด์ผ่านเว็บเบราว์เซอร์ได้ทันทีโดยไม่ต้องติดตั้งเซิร์ฟเวอร์ในเครื่อง และแนะนำให้ดาวน์โหลดติดตั้ง <strong>VS Code</strong> และ <strong>DBeaver</strong> ไว้ในเครื่องคอมพิวเตอร์เพื่อใช้เขียนสคริปต์ SQL และฝึกฝนการเชื่อมต่อระบบฐานข้อมูลระดับมืออาชีพ
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
