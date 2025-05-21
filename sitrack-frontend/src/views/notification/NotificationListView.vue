<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Notifikasi" />
      <div class="flex-1 p-4 main-content overflow-auto pt-20">
        <div class="container mx-auto max-w-5xl">
          <div class="card">
            <div class="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
              <div class="flex flex-wrap gap-2 w-full lg:w-auto justify-start">
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
                class="bg-[#EB5757] hover:bg-[#C64646] text-white px-4 py-2 rounded flex items-center gap-2 min-h-[48px] w-full lg:w-auto"
                @click="bulkDelete"
              />
            </div>
            <div class="table-container">
              <div v-if="store.loading" class="flex justify-center py-8">
                <i class="pi pi-spin pi-spinner text-3xl text-primary"></i>
              </div>
              <div v-else-if="filteredNotifications.length === 0" class="bg-white rounded-lg p-6 text-center text-gray-500">
                Tidak ada notifikasi
              </div>
              <div v-else>
                <div class="card">
                  <div class="scrollable-table-wrapper">
                    <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                      <thead>
                        <tr>
                          <th class="py-3 px-4 text-center text-xl w-16 sticky-header">No.</th>
                          <th class="py-3 px-4 text-left text-xl w-full sticky-header">Notifikasi</th>
                          <th class="py-3 px-4 text-center w-12 sticky-header"></th>
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
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>

    <ConfirmationDialog
      :visible="showConfirmDialog"
      :message="dialogMessage"
      @close="showConfirmDialog = false"
      @confirm="confirmBulkDelete"
    />
    <SuccessDialog
      :visible="showSuccessDialog"
      :message="dialogMessage"
      @close="showSuccessDialog = false"
    />
    <ErrorDialog
      :visible="showErrorDialog"
      :message="dialogMessage"
      @close="showErrorDialog = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { useAuthStore } from '@/stores/auth'
import type { Notification } from '@/interfaces/notification.interfaces'
import Sidebar from '@/components/vSidebar.vue'
import HeaderComponent from '@/components/vHeader.vue'
import FooterComponent from '@/components/vFooter.vue'
import VButton from '@/components/VButton.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import SuccessDialog from '@/components/SuccessDialog.vue'
import ErrorDialog from '@/components/ErrorDialog.vue'

const router = useRouter()
const store = useNotificationStore()
const authStore = useAuthStore()

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Reference', value: 'reference' },
  { label: 'Order', value: 'order' },
  { label: 'SPJ', value: 'spj' },
  { label: 'Inventory', value: 'inventory' }
]

const activeTab = ref('all')
const selectedIds = ref<number[]>([])

const showConfirmDialog = ref(false)
const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const dialogMessage = ref('')

const filteredNotifications = computed(() => {
  const userNotifications = store.notifications
  let filtered = []

  if (activeTab.value === 'all') filtered = userNotifications
  else if (activeTab.value === 'reference') {
    filtered = userNotifications.filter(n => 
      ['VEHICLE_STNK_EXPIRY', 'VEHICLE_KIR_EXPIRY', 'CHASSIS_KIR_EXPIRY', 'DRIVER_SIM_EXPIRY']
      .includes(n.category)
    )
  } else if (activeTab.value === 'order') {
    filtered = userNotifications.filter(n => ['ORDER_UPDATE'].includes(n.category))
  } else if (activeTab.value === 'inventory') {
    filtered = userNotifications.filter(n => ['REQUEST_ASSET_UPDATE'].includes(n.category))
  } else if (activeTab.value === 'spj') {
    filtered = userNotifications.filter(n => ['SPJ_UPDATE'].includes(n.category))
  } else {
    filtered = userNotifications.filter(n => n.category === activeTab.value.toUpperCase())
  }

  filtered = filtered.filter(notif => {
    if (authStore.role === 'Operasional') {
      return notif.category !== 'REQUEST_ASSET_UPDATE'
    } else if (authStore.role === 'Mekanik') {
      return notif.category !== 'ORDER_UPDATE'
    }
    return true
  })

  return filtered.sort((a, b) => (b.isRead ? 0 : 1) - (a.isRead ? 0 : 1))
})

const handleNotificationClick = async (notif: Notification) => {
  if (!notif.isRead) {
    await store.markAsRead(notif.id)
    notif.isRead = true
  }
  router.push(notif.redirectEndpoint)
}

function formatMessage(notif: Notification): string {
  if (notif.category === 'ORDER_UPDATE' || notif.category === 'REQUEST_ASSET_UPDATE' || notif.category === 'SPJ_UPDATE') {
    if (notif.title && notif.title.includes('Persetujuan')) {
      if (authStore.role === 'Operasional' || authStore.role === 'Mekanik') {
        return `<span class="text-blue-900 font-bold">[Pending Approval]</span> ${notif.message}`
      }
      if (['Supervisor', 'Manager', 'Admin'].includes(authStore.role)) {
        return `<span class="text-blue-900 font-bold">[Approval Needed]</span> ${notif.message}`
      }
    }
    if (notif.title && notif.title.includes('Status')) {
      return `<span class="text-blue-900 font-bold">[Status Update]</span> ${notif.message}`
    }
  }

  if (['VEHICLE_STNK_EXPIRY', 'VEHICLE_KIR_EXPIRY', 'CHASSIS_KIR_EXPIRY', 'DRIVER_SIM_EXPIRY'].includes(notif.category)) {
    return `<span class="text-blue-900 font-bold">[Expiring]</span> ${notif.message}`
  }

  const { message, referenceType, referenceId } = notif
  const docType = notif.title ? notif.title.split(' ')[0] : ''
  let formatted = message.replace(docType, `<b>${docType}</b>`)
  formatted = formatted.replace(referenceType, `<b>${referenceType}</b>`)
  formatted = formatted.replace(referenceId, `<b>${referenceId}</b>`)
  formatted = formatted.replace(/(expired)/gi, '<i>$1</i>')
  return formatted
}

function bulkDelete() {
  const deletableIds = selectedIds.value.filter(id => {
    const notif = store.notifications.find(n => n.id === id)
    return notif && notif.isRead
  })
  if (selectedIds.value.length === 0) {
    dialogMessage.value = 'Pilih notifikasi yang ingin dihapus terlebih dahulu.'
    showErrorDialog.value = true
    return
  }
  if (deletableIds.length === 0) {
    dialogMessage.value = 'Notifikasi yang dipilih belum bisa dihapus. Hanya notifikasi yang sudah dibaca yang bisa dihapus.'
    showErrorDialog.value = true
    return
  }
  if (deletableIds.length < selectedIds.value.length) {
    dialogMessage.value = 'Beberapa notifikasi yang dipilih belum bisa dihapus. Lanjutkan hapus yang sudah dibaca?'
  } else {
    dialogMessage.value = `Yakin ingin menghapus ${deletableIds.length} notifikasi?`
  }
  showConfirmDialog.value = true
}

async function confirmBulkDelete() {
  showConfirmDialog.value = false
  const deletableIds = selectedIds.value.filter(id => {
    const notif = store.notifications.find(n => n.id === id)
    return notif && notif.isRead
  })
  await store.bulkDeleteNotifications(deletableIds)
  dialogMessage.value = 'Notifikasi berhasil dihapus.'
  showSuccessDialog.value = true
  selectedIds.value = []
  await store.fetchUserNotifications()
}

onMounted(() => {
  store.fetchUserNotifications()
})
</script>

<style scoped>
.scrollable-table-wrapper {
  max-height: 550px;
  overflow-y: auto;
  position: relative;
}

.sticky-header {
  position: sticky;
  top: 0;
  background: #1C5D99;
  color: white;
  z-index: 2;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background: #1C5D99;
  z-index: 1;
}

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

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f3f4f6 !important;
}

:deep(.p-datatable .p-datatable-thead > tr > th),
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  white-space: normal !important;
  word-break: break-word !important;
}

@media screen and (max-width: 768px) {
  .table-container {
    margin: 0 -1rem;
    padding: 0 1rem;
  }
  .card {
    padding: 1rem;
  }
  :deep(.p-datatable) {
    font-size: 0.9rem;
  }
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
    white-space: normal !important;
    word-break: break-word !important;
  }
  .flex.flex-wrap.gap-2.w-full {
    flex-wrap: wrap !important;
    justify-content: flex-start !important;
    row-gap: 0.5rem;
  }
  .flex.flex-col.lg\:flex-row.justify-between.items-center.mb-4.gap-4 > .w-full {
    width: 100% !important;
  }
}

@media screen and (max-width: 480px) {
  .table-container {
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }
  .card {
    padding: 0.5rem;
  }
  :deep(.p-datatable) {
    font-size: 0.8rem;
  }
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.4rem;
    white-space: normal !important;
    word-break: break-word !important;
  }
}
</style>
