import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'

// SHTO:
import Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// SHTO:
app.use(Toastify, {
    position: "top-right", // top-right, top-center, bottom-right, etj.
    autoClose: 2500,       // ms, sa të qëndrojë mesazhi
});

app.mount('#app')
