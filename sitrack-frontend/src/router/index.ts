import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import CreateUserView from '../views/CreateUserView.vue'
import EditUserView from '../views/EditUserView.vue'
import CustomerListView from '../views/CustomerListView.vue'
import CreateCustomerView from '../views/CreateCustomerView.vue'
import EditCustomerView from '../views/EditCustomerView.vue'
import CustomerDetailView from '../views/CustomerDetailView.vue'

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
      path: '/customers',
      name: 'customers',
      component: CustomerListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/create',
      name: 'create customers',
      component: CreateCustomerView,
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/edit',
      name: 'edit customers',
      component: EditCustomerView,
      meta: { requiresAuth: true },
      props: (route) => ({ siteId: route.query.siteId }),
    },
    {
      path: '/customers/detail',
      name: 'detail customers',
      component: CustomerDetailView,
      meta: { requiresAuth: true },
      props: (route) => ({ siteId: route.query.siteId }),
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
