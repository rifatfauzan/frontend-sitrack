import './assets/index.css'
import './assets/custom.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const app = createApp(App)
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        }
    }
});
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false
        }
    }
})

app.use(Toast)
app.use(createPinia())
app.use(router)

app.mount('#app')