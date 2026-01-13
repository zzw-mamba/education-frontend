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
    component: Profile
  },
  {
    path: '/data-source',
    name: 'DataSource',
    component: DataSource
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBase
  },
  {
    path: '/ocr-upload',
    name: 'OcrUpload',
    component: OcrUpload
  },
  {
    path: '/template-select',
    name: 'TemplateSelect',
    component: TemplateSelect
  },
  {
    path: '/template-library',
    name: 'TemplateLibrary',
    component: TemplateLibrary
  },
  {
    path: '/summary-generate',
    name: 'SummaryGenerate',
    component: SummaryGenerate
  },
  {
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
router.beforeEach((to, from, next) => {
  // 可以在这里实现步骤控制逻辑
  // 例如：只有完成前一步才能进入下一步
  next()
})

export default router
