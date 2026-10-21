import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn, authUser } from '../data/authStore'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import MyCoursesView from '../views/MyCoursesView.vue'
import SubjectsView from '../views/SubjectsView.vue'
import ClassmatesView from '../views/ClassmatesView.vue'
import DatabaseWeek1 from '../views/database/Week1View.vue'
import PlatformWeek1 from '../views/platform/Week1View.vue'
import DataAnalysisWeek1 from '../views/analysis/Week1View.vue'
import IoTWeek1 from '../views/iot/Week1View.vue'
import IoTWeek2 from '../views/iot/Week2View.vue'
import ToolsView from '../views/ToolsView.vue'
import TeacherView from '../views/TeacherView.vue'
import ScheduleView from '../views/ScheduleView.vue'
import StudentsManagementView from '../views/StudentsManagementView.vue'
import GradebookView from '../views/GradebookView.vue'
import QuestsView from '../views/QuestsView.vue'
import CoinsManagementView from '../views/CoinsManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'courses',
          name: 'courses',
          component: SubjectsView
        },
        {
          path: 'course/:id',
          name: 'course',
          component: MyCoursesView
        },
        {
          path: 'course/31901-2007/week/1',
          name: 'database-week1',
          component: DatabaseWeek1
        },
        {
          path: 'course/21901-2012/week/1',
          name: 'platform-week1',
          component: PlatformWeek1
        },
        {
          path: 'course/31901-2012/week/1',
          name: 'data-analysis-week1',
          component: DataAnalysisWeek1
        },
        {
          path: 'course/21901-2007/week/1',
          name: 'iot-week1',
          component: IoTWeek1
        },
        {
          path: 'course/21901-2007/week/2',
          name: 'iot-week2',
          component: IoTWeek2
        },
        {
          path: 'course/:id/classmates',
          name: 'classmates',
          component: ClassmatesView
        },
        {
          path: 'settings',
          redirect: '/'
        },
        {
          path: 'course/:id/tools',
          name: 'tools',
          component: ToolsView
        },
        {
          path: 'teacher',
          name: 'teacher',
          component: TeacherView
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: ScheduleView
        },
        {
          path: 'students',
          name: 'students',
          component: StudentsManagementView,
          meta: { requiresTeacher: true }
        },
        {
          path: 'gradebook',
          name: 'gradebook',
          component: GradebookView
        },
        {
          path: 'quests',
          name: 'quests',
          component: QuestsView
        },
        {
          path: 'coins',
          name: 'coins',
          component: CoinsManagementView,
          meta: { requiresTeacher: true }
        },
        {
          path: 'shop',
          name: 'shop',
          component: () => import('../views/ShopView.vue')
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('../views/InventoryView.vue')
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: () => import('../views/AnnouncementManagementView.vue'),
          meta: { requiresTeacher: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const role = (authUser.value?.role || '').toLowerCase()
  const isTeacher = ['teacher', 'อาจารย์', 'ครู', 'admin'].includes(role)

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn.value) {
    next('/')
  } else if (to.meta.requiresTeacher && !isTeacher) {
    next('/')
  } else {
    next()
  }
})

export default router
