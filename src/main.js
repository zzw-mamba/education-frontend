import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'font-awesome/css/font-awesome.min.css'
// 导入Tailwind CSS - 必须在 Element Plus 之后导入以避免样式冲突
import './assets/styles/tailwind.css'
import App from './App.vue'
import router from './router'
import { useAppStore } from './store'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';
import 'katex/dist/katex.min.css';

const app = createApp(App)
const pinia = createPinia()
VMdPreview.use(createKatexPlugin());

app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 全局初始化登录状态
const store = useAppStore()
store.initAuth()

app.mount('#app')
