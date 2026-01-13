import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'font-awesome/css/font-awesome.min.css'
import { useAppStore } from './store'

// 导入Tailwind CSS
import './assets/styles/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 全局初始化登录状态
const store = useAppStore()
store.initAuth()

app.mount('#app')
