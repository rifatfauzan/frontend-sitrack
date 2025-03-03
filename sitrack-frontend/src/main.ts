import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'


import PrimeVue from 'primevue/config'
import Lara from '@primevue/themes/lara'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(PrimeVue)
app.use(Toast)
app.use(createPinia())
app.use(router)

app.mount('#app')
