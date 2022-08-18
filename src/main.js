import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//导入当前项目的全局管理对象
import store from './store'

//导入element-plus
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

//导入El图标
import ElIcon from "@element-plus/icons-vue"
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')