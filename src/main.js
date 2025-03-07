import '../src/scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router'
import '@fortawesome/fontawesome-free/css/all.css';


const pinia = createPinia()
createApp(App).use(router).use(pinia).mount('#app')
