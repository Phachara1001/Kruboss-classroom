import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn, authUser } from '../data/authStore'
import { isMainTeacher, isSubjectTeacher, isAnyTeacher, canViewCourse } from '../data/studentsStore'
import DefaultLayout from '../layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('../views/SubjectsView.vue')
        },
        {
          path: 'course/:id',
          name: 'course',
          component: () => import('../views/MyCoursesView.vue')
        },
        {
          path: 'course/31901-2007/week/1',
          name: 'database-week1',
          component: () => import('../views/database/Week1View.vue')
        },
        {
          path: 'course/31901-2007/week/2',
          name: 'database-week2',
          component: () => import('../views/database/Week2View.vue')
        },
        {
          path: 'course/31901-2007/week/3',
          name: 'database-week3',
          component: () => import('../views/database/Week3View.vue')
        },
        {
          path: 'course/31901-2007/week/4',
          name: 'database-week4',
          component: () => import('../views/database/Week4View.vue')
        },
        {
          path: 'course/31901-2007/week/5',
          name: 'database-week5',
          component: () => import('../views/database/Week5View.vue')
        },
        {
          path: 'course/21901-2012/week/1',
          name: 'platform-week1',
          component: () => import('../views/platform/Week1View.vue')
        },
        {
          path: 'course/21901-2012/week/2',
          name: 'platform-week2',
          component: () => import('../views/platform/Week2View.vue')
        },
        {
          path: 'course/21901-2012/week/3',
          name: 'platform-week3',
          component: () => import('../views/platform/Week3View.vue')
        },
        {
          path: 'course/31901-2012/week/1',
          name: 'data-analysis-week1',
          component: () => import('../views/analysis/Week1View.vue')
        },
        {
          path: 'course/31901-2012/week/2',
          name: 'data-analysis-week2',
          component: () => import('../views/analysis/Week2View.vue')
        },
        {
          path: 'course/31901-2012/week/3',
          name: 'data-analysis-week3',
          component: () => import('../views/analysis/Week3View.vue')
        },
        {
          path: 'course/31901-2012/week/4',
          name: 'data-analysis-week4',
          component: () => import('../views/analysis/Week4View.vue')
        },
        {
          path: 'course/21901-2007/week/1',
          name: 'iot-week1',
          component: () => import('../views/iot/Week1View.vue')
        },
        {
          path: 'course/21901-2007/week/2',
          name: 'iot-week2',
          component: () => import('../views/iot/Week2View.vue')
        },
        {
          path: 'course/21901-2007/week/3',
          name: 'iot-week3',
          component: () => import('../views/iot/Week3View.vue')
        },
        {
          path: 'course/21901-2007/week/4',
          name: 'iot-week4',
          component: () => import('../views/iot/Week4View.vue')
        },
        {
          path: 'course/:id/classmates',
          name: 'classmates',
          component: () => import('../views/ClassmatesView.vue')
        },
        {
          path: 'settings',
          redirect: '/'
        },
        {
          path: 'course/:id/tools',
          name: 'tools',
          component: () => import('../views/ToolsView.vue')
        },
        {
          path: 'teacher',
          name: 'teacher',
          component: () => import('../views/TeacherView.vue')
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('../views/ScheduleView.vue')
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('../views/StudentsManagementView.vue'),
          meta: { requiresMainTeacher: true }
        },
        {
          path: 'teachers',
          name: 'teachers',
          component: () => import('../views/TeachersManagementView.vue'),
          meta: { requiresMainTeacher: true }
        },
        {
          path: 'gradebook',
          name: 'gradebook',
          component: () => import('../views/GradebookView.vue')
        },
        {
          path: 'quests',
          name: 'quests',
          component: () => import('../views/QuestsView.vue')
        },
        {
          path: 'coins',
          name: 'coins',
          component: () => import('../views/CoinsManagementView.vue'),
          meta: { requiresMainTeacher: true }
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
          path: 'wallet',
          name: 'wallet',
          component: () => import('../views/CoinStatementView.vue')
        },
        {
          path: 'announcements',
          name: 'announcements',
          component: () => import('../views/AnnouncementManagementView.vue'),
          meta: { requiresMainTeacher: true }
        },
        {
          path: 'arcade',
          name: 'arcade',
          component: () => import('../views/ArcadeView.vue')
        },
        {
          path: 'assignments-management',
          name: 'assignments-management',
          component: () => import('../views/AssignmentsManagementView.vue'),
          meta: { requiresMainTeacher: true }
        },
        {
          path: 'learning-achievement',
          name: 'learning-achievement',
          component: () => import('../views/LearningAchievementView.vue'),
          meta: { requiresMainTeacher: true }
        },
        {
          path: 'submission-analytics',
          name: 'submission-analytics',
          component: () => import('../views/SubmissionAnalyticsView.vue'),
          meta: { requiresMainTeacher: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return '/login'
  }
  if (to.path === '/login' && isLoggedIn.value) {
    return '/'
  }
  if (to.meta.requiresMainTeacher && !isMainTeacher(authUser.value)) {
    return '/'
  }
  if (to.meta.requiresTeacher && !isAnyTeacher(authUser.value)) {
    return '/'
  }
  if (isSubjectTeacher(authUser.value) && to.path.startsWith('/course/')) {
    const courseId = to.params.id || to.path.match(/^\/course\/([^/]+)/)?.[1]
    if (courseId && !canViewCourse(authUser.value, courseId)) {
      return '/courses'
    }
  }
})

export default router
