<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Notifikasi" />
      <div class="flex-1 p-4 main-content pt-20">
        <div class="container mx-auto max-w-5xl">
          <div class="flex justify-between items-center mb-4">
            <div class="flex gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                @click="activeTab = tab.value"
                :class="[
                  'tab-btn px-4 py-2 rounded font-medium font-semibold min-h-[48px] text-lg',
                  activeTab === tab.value ? 'active bg-[#1C5D99] text-white' : 'bg-gray-100 text-gray-700'
                ]"
              >
                {{ tab.label }}
              </button>
            </div>
            <VButton
              title="Hapus"
              icon="pi pi-trash"
              class="bg-[#EB5757] hover:bg-[#C64646] text-white px-4 py-2 rounded flex items-center gap-2 min-h-[48px]"
              @click="bulkDelete"
            />
          </div>
          <div v-if="store.loading" class="flex justify-center py-8">
            <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
          </div>
          <div v-else-if="filteredNotifications.length === 0" class="bg-white rounded-lg p-6 text-center text-gray-500">
            Tidak ada notifikasi
          </div>
          <div v-else>
            <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
              <thead>
                <tr class="bg-[#1C5D99] text-white text-lg font-bold">
                  <th class="py-3 px-4 text-center w-16">No.</th>
                  <th class="py-3 px-4 text-left w-full"></th>
                  <th class="py-3 px-4 text-center w-12"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(notif, idx) in filteredNotifications"
                  :key="notif.id"
                  :class="[
                    'cursor-pointer transition',
                    idx % 2 === 0
                      ? 'bg-[#FAFAFF] hover:bg-[#E0E0E0] rounded-lg'
                      : 'bg-[#BBCDE5] hover:bg-[#A4BEE0] rounded-lg',
                    !notif.isRead ? 'unread-row' : ''
                  ]"
                  @click="handleNotificationClick(notif)"
                >
                  <td class="py-3 px-4 text-center text-lg font-semibold">{{ idx + 1 }}</td>
                  <td class="py-3 px-4 text-lg flex items-center gap-2">
                    <span class="text-xl" v-html="formatMessage(notif)"></span>
                    <span v-if="!notif.isRead" class="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">New</span>
                  </td>
                  <td class="py-3 px-4 text-center" @click.stop>
                    <input
                      type="checkbox"
                      v-model="selectedIds"
                      :value="notif.id"
                      class="outline-checkbox"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import Sidebar from '@/components/Sidebar.vue'
import VButton from '@/components/VButton.vue'
import HeaderComponent from '@/components/Header.vue'
import FooterComponent from '@/components/Footer.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const store = useNotificationStore()
const router = useRouter()

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Reference', value: 'reference' },
  { label: 'SPJ', value: 'spj' },
  { label: 'Order', value: 'order' },
  { label: 'Inventory', value: 'inventory' }
]
const activeTab = ref('all')
const selectedIds = ref<number[]>([])

const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') return store.notifications
  if (activeTab.value === 'reference') {
    return store.notifications.filter(n =>
      ['VEHICLE_STNK_EXPIRY', 'VEHICLE_KIR_EXPIRY', 'CHASSIS_KIR_EXPIRY', 'DRIVER_SIM_EXPIRY'].includes(n.category)
    )
  }
  if (activeTab.value === 'order') {
    return store.notifications.filter(n =>
      ['ORDER_UPDATE'].includes(n.category)
    )
  }
  return store.notifications.filter(n => n.category === activeTab.value.toUpperCase())
})

const handleNotificationClick = async (notif: any) => {
  if (!notif.isRead) {
    await store.markAsRead(notif.id)
  }
  router.push(notif.redirectEndpoint)
}

function formatMessage(notif: any): string {
  if (notif.category === 'ORDER_UPDATE') {
    if (notif.title && notif.title.includes('Persetujuan')) {
      if (authStore.role === 'Operasional') {
        return `<span class="text-blue-900 font-bold">[Pending Approval]</span> ${notif.message}`
      }
      if (['Supervisor', 'Manager', 'Admin'].includes(authStore.role)) {
        return `<span class="text-blue-900 font-bold">[Approval Needed]</span> ${notif.message}`
      }
    }
    if (notif.title && notif.title.includes('Status')) {
      return `<span class="text-blue-900 font-bold">[Status Order]</span> ${notif.message}`
    }
  }

  if (notif.category === 'VEHICLE_STNK_EXPIRY' || notif.category === 'VEHICLE_KIR_EXPIRY' || notif.category === 'CHASSIS_KIR_EXPIRY' || notif.category === 'DRIVER_SIM_EXPIRY') {
    return `<span class="text-blue-900 font-bold">[Expiring]</span> ${notif.message}`
  }

  const { message, referenceType, referenceId } = notif
  const docType = notif.title ? notif.title.split(' ')[0] : ''
  let formatted = message.replace(docType, `<b>${docType}</b>`)
  formatted = formatted.replace(referenceType, `<b>${referenceType}</b>`)
  formatted = formatted.replace(referenceId, `<b>${referenceId}</b>`)
  formatted = formatted.replace(/(expired|expired)/gi, '<i>$1</i>')
  return formatted
}

function bulkDelete() {
  alert('Bulk delete: ' + selectedIds.value.join(', '))
}

onMounted(() => {
  store.fetchAllNotifications()
})
</script>

<style scoped>
.outline-checkbox {
  border: 2px solid #222222;
  border-radius: 4px;
  width: 22px;
  height: 22px;
  accent-color: #1C5D99;
}

.unread-row {
  border-left: 8px solid #1C5D99 !important;
}

.tab-btn:not(.active):hover {
  background-color: #e0e7ef !important;
  color: #1C5D99 !important;
  transition: background 0.2s, color 0.2s;
}
</style>
