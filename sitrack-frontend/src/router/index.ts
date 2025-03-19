import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import CreateUserView from '../views/CreateUserView.vue'
import EditUserView from '../views/EditUserView.vue'
import CreateSopirView from '@/views/CreateSopirView.vue'
import ViewallSopirView from '@/views/ViewallSopirView.vue'
import ViewDetailSopirView from '@/views/ViewDetailSopirView.vue'
import EditSopirView from '@/views/EditSopirView.vue'

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
    },{
      path: '/sopir/add',
      name: 'add sopir',
      component: CreateSopirView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sopir/viewall',
      name: 'viewall sopir',
      component : ViewallSopirView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sopir/:driverId',
      name: 'detail sopir',
      component: ViewDetailSopirView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/sopir/update/:driverId',
      name: 'update sopir',
      component: EditSopirView,
      meta: { requiresAuth: true },
      props: true,
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
