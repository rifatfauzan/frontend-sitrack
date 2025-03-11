import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import CreateUserView from '../views/CreateUserView.vue'
import EditUserView from '../views/EditUserView.vue'
import ChassisListView from '../views/chassis/ChassisListView.vue'
import ChassisDetailView from '../views/chassis/ChassisDetailView.vue'

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
      path: '/users',
      name: 'users',
      component: UserListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create',
      name: 'create users',
      component: CreateUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/edit',
      name: 'edit users',
      component: EditUserView,
      meta: { requiresAuth: true },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/',
      redirect: '/login'
    },
    
    {
      path: '/chassis',
      name: 'view all chassis',
      component: ChassisListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chassis/detail',
      name: 'detail chassis',
      component: ChassisDetailView,
      meta: { requiresAuth: true },
      props: (route) => ({ id: route.query.id }) // Kirim ID sebagai prop
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
