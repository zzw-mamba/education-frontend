import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import DataSource from '../pages/DataSource.vue'
import KnowledgeBase from '../pages/KnowledgeBase.vue'
import OcrUpload from '../pages/OcrUpload.vue'
import TemplateSelect from '../pages/TemplateSelect.vue'
import TemplateLibrary from '../pages/TemplateLibrary.vue'
import SummaryGenerate from '../pages/SummaryGenerate.vue'
import ResultView from '../pages/ResultView.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import { useAppStore } from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/data-source',
    name: 'DataSource',
    component: DataSource,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBase,
    meta: { requiresAuth: true }
  },
  {
    path: '/ocr-upload',
    name: 'OcrUpload',
    meta: { requiresAuth: true },
    component: OcrUpload
  },
  {
    path: '/template-select',
    meta: { requiresAuth: true },
    name: 'TemplateSelect',
    component: TemplateSelect
  },
  {
    path: '/template-library',
    meta: { requiresAuth: true },
    name: 'TemplateLibrary',
    component: TemplateLibrary
  },
  {
    meta: { requiresAuth: true },
    path: '/summary-generate',
    name: 'SummaryGenerate',
    component: SummaryGenerate
  },
  {
    meta: { requiresAuth: true },
    path: '/result-view',
    name: 'ResultView',
    component: ResultView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 导航守卫
router.beforeEach(async (to, from, next) => {
  const store = useAppStore()

  // 检查路由是否需要登录
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    // 显示自定义认证对话框
    if (globalThis.$authDialog && globalThis.$authDialog.value) {
      globalThis.$authDialog.value.show(to.fullPath)
    }
    // 停留在当前页面
    next(false)
  } else {
    next()
  }
})

export default router
