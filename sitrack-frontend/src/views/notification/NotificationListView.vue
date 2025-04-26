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
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import SuccessDialog from '@/components/SuccessDialog.vue'
import ErrorDialog from '@/components/ErrorDialog.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const store = useNotificationStore()
const router = useRouter()

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
  const userNotifications = store.notifications;

  let filtered = [];
  if (activeTab.value === 'all') filtered = userNotifications;
  else if (activeTab.value === 'reference') {
    filtered = userNotifications.filter(n => 
      ['VEHICLE_STNK_EXPIRY', 'VEHICLE_KIR_EXPIRY', 'CHASSIS_KIR_EXPIRY', 'DRIVER_SIM_EXPIRY']
      .includes(n.category)
    );
  }
  else if (activeTab.value === 'order') {
    filtered = userNotifications.filter(n => ['ORDER_UPDATE'].includes(n.category));
  }
  else if (activeTab.value === 'inventory') {
    filtered = userNotifications.filter(n => ['REQUEST_ASSET_UPDATE'].includes(n.category));
  }
  else {
    filtered = userNotifications.filter(n => n.category === activeTab.value.toUpperCase());
  }

  return filtered.filter(notif => {
    if (authStore.role === 'Operasional') {
      return notif.category !== 'REQUEST_ASSET_UPDATE';
    }
    else if (authStore.role === 'Mekanik') {
      return notif.category !== 'ORDER_UPDATE';
    }
    return true;
  });
});

const handleNotificationClick = async (notif: any) => {
  if (!notif.isRead) {
    await store.markAsRead(notif.id)
  }
  router.push(notif.redirectEndpoint)
}

function formatMessage(notif: any): string {
  if (notif.category === 'ORDER_UPDATE' || notif.category === 'REQUEST_ASSET_UPDATE') {
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
    dialogMessage.value = 'Beberapa notifikasi yang dipilih belum bisa dihapus. Hanya notifikasi yang sudah dibaca yang bisa dihapus. Lanjutkan hapus yang sudah dibaca?'
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