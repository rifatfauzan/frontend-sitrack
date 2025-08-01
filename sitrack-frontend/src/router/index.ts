import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import UserListView from '../views/users/UserListView.vue'
import CreateUserView from '../views/users/CreateUserView.vue'
import EditUserView from '../views/users/EditUserView.vue'
import CreateSopirView from '@/views/driver/CreateSopirView.vue'
import ViewallSopirView from '@/views/driver/ViewallSopirView.vue'
import ViewDetailSopirView from '@/views/driver/ViewDetailSopirView.vue'
import EditSopirView from '@/views/driver/EditSopirView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import ChassisListView from '../views/chassis/ChassisListView.vue'
import ChassisDetailView from '../views/chassis/ChassisDetailView.vue'
import CreateChassisView from '../views/chassis/CreateChassisView.vue'
import EditChassisView from '../views/chassis/EditChassisView.vue'
import CustomerListView from '../views/customer/CustomerListView.vue'
import CreateCustomerView from '../views/customer/CreateCustomerView.vue'
import EditCustomerView from '../views/customer/EditCustomerView.vue'
import CustomerDetailView from '../views/customer/CustomerDetailView.vue'
import TruckListView from '@/views/trucks/TruckListView.vue'
import CreateTruckView from '@/views/trucks/CreateTruckView.vue'
import TruckDetailView from '@/views/trucks/TruckDetailView.vue'
import EditTruckView from '@/views/trucks/EditTruckView.vue'
import NotificationListView from '@/views/notification/NotificationListView.vue'
import EditAssetView from '@/views/asset/EditAssetView.vue'
import AssetListView from '@/views/asset/AssetListView.vue'
import CreateAssetView from '@/views/asset/CreateAssetView.vue'
import RequestAssetListView from '@/views/requestAsset/RequestAssetListView.vue'
import CreateRequestAssetView from '@/views/requestAsset/CreateRequestAssetView.vue'
import DetailRequestAssetView from '@/views/requestAsset/DetailRequestAssetView.vue'
import OrderListView from '@/views/order/OrderListView.vue'
import OrderDetailView from '@/views/order/OrderDetailView.vue'
import CreateOrderView from '@/views/order/CreateOrderView.vue'
import DetailAssetView from '@/views/asset/DetailAssetView.vue'
import EditRequestAssetView from '@/views/requestAsset/EditRequestAssetView.vue'
import VehicleOutListView from '@/views/spj/VehicleOutListView.vue'
import VehicleInListView from '@/views/spj/VehicleInListView.vue'
import CreateSpjView from '@/views/spj/CreateSpjView.vue'
import SpjDetailView from '@/views/spj/SpjDetailView.vue'
import ReportingView from '../views/reporting/ReportingView.vue'

import EditOrderView from '@/views/order/EditOrderView.vue'
import EditSpjView from '@/views/spj/EditSpjView.vue'

import CreateReportTruckView from '@/views/reportTruck/CreateReportTruckView.vue'
import ReportTruckListView from '@/views/reportTruck/ReportTruckListView.vue'
import KomisiListView from '@/views/komisi/KomisiListView.vue'
import CreateKomisiView from '@/views/komisi/CreateKomisiView.vue'
import DetailKomisiView from '@/views/komisi/DetailKomisiView.vue'
import EditKomisiView from '@/views/komisi/EditKomisiView.vue'

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
      meta: { public: true },
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: UserListView,
      meta: {
        requiresAuth: true,
        authorize: ['Admin'],
      },
    },
    {
      path: '/users/create',
      name: 'create users',
      component: CreateUserView,
      meta: {
        requiresAuth: true,
        authorize: ['Admin'],
      },
    },
    {
      path: '/users/edit',
      name: 'edit users',
      component: EditUserView,
      meta: {
        requiresAuth: true,
        authorize: ['Admin'],
      },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
      meta: { public: true },
    },

    {
      path: '/chassis',
      name: 'view all chassis',
      component: ChassisListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/chassis/detail',
      name: 'detail chassis',
      component: ChassisDetailView,
      meta: { requiresAuth: true, authorize: ['Supervisor', 'Manager', 'Admin'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/chassis/create',
      name: 'create chassis',
      component: CreateChassisView,
      meta: { requiresAuth: true, authorize: ['Supervisor', 'Manager', 'Admin'] },
    },
    {
      path: '/chassis/edit',
      name: 'edit chassis',
      component: EditChassisView,
      meta: { requiresAuth: true, authorize: ['Supervisor', 'Manager', 'Admin'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/',
      redirect: '/login',
    },

    {
      path: '/customers',
      name: 'customers',
      component: CustomerListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/customers/create',
      name: 'create customers',
      component: CreateCustomerView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/customers/edit',
      name: 'edit customers',
      component: EditCustomerView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: (route) => ({ siteId: route.query.siteId }),
    },
    {
      path: '/customers/detail',
      name: 'detail customers',
      component: CustomerDetailView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: (route) => ({ siteId: route.query.siteId }),
    },

    // Route untuk Truck Management
    {
      path: '/trucks',
      name: 'trucks',
      component: TruckListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/trucks/create',
      name: 'create truck',
      component: CreateTruckView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/trucks/edit',
      name: 'edit truck',
      component: EditTruckView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/trucks/detail',
      name: 'truck detail',
      component: TruckDetailView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: (route) => ({ id: route.query.id }),
    },

    {
      path: '/sopir/add',
      name: 'add sopir',
      component: CreateSopirView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/sopir/viewall',
      name: 'viewall sopir',
      component: ViewallSopirView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },
    {
      path: '/sopir/:driverId',
      name: 'detail sopir',
      component: ViewDetailSopirView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: true,
    },
    {
      path: '/sopir/update/:driverId',
      name: 'update sopir',
      component: EditSopirView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: true,
    },

    {
      path: '/notifications',
      name: 'view all notification',
      component: NotificationListView,
      meta: {
        requiresAuth: true,
        authorize: ['Supervisor', 'Manager', 'Admin', 'Operasional', 'Mekanik'],
      },
    },

    {
      path: '/assets',
      name: 'assets',
      component: AssetListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager', 'Mekanik'] },
    },
    {
      path: '/assets/create',
      name: 'create asset',
      component: CreateAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
    },

    {
      path: '/orders',
      name: 'view all order',
      component: OrderListView,
      meta: { requiresAuth: true, authorize: ['Operasional', 'Supervisor', 'Manager', 'Admin'] },
    },
    {
      path: '/orders',
      name: 'view all order',
      component: OrderListView,
      meta: { requiresAuth: true, authorize: ['Operasional', 'Supervisor', 'Manager', 'Admin'] },
    },
    {
      path: '/request-assets',
      name: 'request assets',
      component: RequestAssetListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager', 'Mekanik'] },
    },
    {
      path: '/request-assets/create',
      name: 'create request asset',
      component: CreateRequestAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Mekanik', 'Supervisor'] },
    },
    {
      path: '/request-assets/detail',
      name: 'detail request asset',
      component: DetailRequestAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager', 'Mekanik'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/request-assets/edit',
      name: 'edit request asset',
      component: EditRequestAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Mekanik', 'Supervisor'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/assets/update/:assetId',
      name: 'update asset',
      component: EditAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager'] },
      props: true,
    },
    {
      path: '/assets/:assetId',
      name: 'detail asset',
      component: DetailAssetView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Supervisor', 'Manager', 'Mekanik'] },
      props: true,
    },

    {
      path: '/orders',
      name: 'view all order',
      component: OrderListView,
      meta: { public: true },
    },
    {
      path: '/order/detail',
      name: 'detail order',
      component: OrderDetailView,
      meta: { requiresAuth: true, authorize: ['Operasional', 'Supervisor', 'Manager', 'Admin'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/order/create',
      name: 'create order',
      component: CreateOrderView,
      meta: { requiresAuth: true, authorize: ['Operasional', 'Supervisor', 'Manager', 'Admin'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/order/edit',
      name: 'edit order',
      component: EditOrderView,
      meta: { requiresAuth: true, authorize: ['Operasional', 'Supervisor', 'Manager', 'Admin'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/vehicle-out',
      name: 'view all vehicle out',
      component: VehicleOutListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
    },
    {
      path: '/vehicle-in',
      name: 'view all vehicle in',
      component: VehicleInListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
    },
    {
      path: '/spj/create',
      name: 'create spj',
      component: CreateSpjView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
    },
    {
      path: '/spj/detail',
      name: 'detail spj',
      component: SpjDetailView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: (route) => ({ id: route.query.id }),
    },
    {
      path: '/spj/edit/:spjId',
      name: 'edit spj',
      component: EditSpjView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: true,
    },
    {
      path: '/reporting',
      name: 'reporting',
      component: ReportingView,
      meta: {
        requiresAuth: true,
        authorize: ['Admin', 'Manager', 'Supervisor', 'Operasional', 'Mekanik'],
      },
    },
    {
      path: '/report-truck/create',
      name: 'create report truck',
      component: CreateReportTruckView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Mekanik', 'Supervisor','Manager'] }
    },
    {
      path: '/report-truck',
      name: 'report truck list',
      component: ReportTruckListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Mekanik', 'Supervisor', 'Manager'] }
    },
    {
      path:'/komisi',
      name: 'view all komisi',
      component: KomisiListView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: true,

    },
    {
      path:'/komisi/create',
      name: 'create komisi',
      component: CreateKomisiView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: true,

    },

    {
      path:'/komisi/detail/:komisiId',
      name: 'detail komisi',
      component: DetailKomisiView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: true,

    },

    {
      path:'/komisi/edit/:komisiId',
      name: 'edit komisi',
      component: EditKomisiView,
      meta: { requiresAuth: true, authorize: ['Admin', 'Operasional', 'Supervisor', 'Manager'] },
      props: true,
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
