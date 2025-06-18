import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { createPinia } from 'pinia'
app.use(createPinia())

import ePlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ePlus)

import vRouter from '@/router'
app.use(vRouter)

// import alova from 'alova'
// app.use(alova)

app.mount('#app')