import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Jika rute memerlukan autentikasi dan tidak ada token
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
  } 
  // Jika sudah login dan mencoba akses halaman login
  else if (to.name === 'login' && token) {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router
