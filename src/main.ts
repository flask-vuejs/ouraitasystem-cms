import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from '@/router'
import http from '@/utils/http'
import 'easymde/dist/easymde.min.css'
// import "core-js";
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.config.globalProperties.$http = http
// Vue中的全局变量类型声明
declare module 'vue' {
  export interface ComponentCustomProperties {
    $http:typeof http
  }
}
app.mount('#app')

// npm run serve

