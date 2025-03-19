import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/UserListView.vue'
import CreateUserView from '../views/CreateUserView.vue'
import EditUserView from '../views/EditUserView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import ChassisListView from '../views/chassis/ChassisListView.vue'
import ChassisDetailView from '../views/chassis/ChassisDetailView.vue'
import CreateChassisView from '../views/chassis/CreateChassisView.vue'
import EditChassisView from '../views/chassis/EditChassisView.vue'

const decodeTokenPayload = (token: string) => {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch (e) {
    console.error('Gagal mendekode token:', e)
    return null
  }
}

const getCurrentUserRole = (): string | null => {
  const token = localStorage.getItem('token')
  if (!token) return null
  const decoded = decodeTokenPayload(token)
  return decoded?.role || null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true }
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
      meta: { 
        requiresAuth: true,
        authorize: ['Admin']
      }
    },
    {
      path: '/users/create',
      name: 'create users',
      component: CreateUserView,
      meta: { 
        requiresAuth: true,
        authorize: ['Admin']
      }
    },
    {
      path: '/users/edit',
      name: 'edit users',
      component: EditUserView,
      meta: { 
        requiresAuth: true,
        authorize: ['Admin']
      },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
      meta: { public: true }
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
      meta: { requiresAuth: true , authorize: ['Supervisor', 'Manager', 'Admin']},
      props: (route) => ({ id: route.query.id })
   },
   {  
    path: '/chassis/create',
    name: 'create chassis',
    component: CreateChassisView,
    meta: { requiresAuth: true , authorize: ['Supervisor', 'Manager', 'Admin']},
  },
  {
    path: '/chassis/edit',
    name: 'edit chassis',
    component: EditChassisView,
    meta: { requiresAuth: true , authorize: ['Supervisor', 'Manager', 'Admin']},
    props: (route) => ({ id: route.query.id }),
  },
    {
      path: '/',
      redirect: '/login'
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = getCurrentUserRole()

  // Redirect ke login untuk rute yang memerlukan auth
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' })
    return
  }

  // Redirect dari login ke home jika sudah login
  if (to.name === 'login' && token) {
    next({ name: 'home' })
    return
  }

  // Cek otorisasi role
  if (to.meta.authorize) {
    const requiredRoles = to.meta.authorize as string[]
    
    if (!userRole || !requiredRoles.includes(userRole)) {
      next({ name: 'unauthorized' })
      return
    }
  }

  next()
})

export default router
