<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useReportTruckStore } from '@/stores/reportTruck'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/vSidebar.vue'
import HeaderComponent from '@/components/vHeader.vue'
import FooterComponent from '@/components/vFooter.vue'
import VButton from '@/components/VButton.vue'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import SuccessDialog from '@/components/SuccessDialog.vue'
import ErrorDialog from '@/components/ErrorDialog.vue'

const router = useRouter()
const reportTruckStore = useReportTruckStore()
const { reportTruckList, loading } = storeToRefs(reportTruckStore)
const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(() => {
  reportTruckStore.fetchReportTrucks()
})

const goToCreate = () => {
  router.push('/report-truck/create')
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formattedReportList = computed(() =>
  reportTruckList.value.map((item) => ({
    ...item,
    formattedDate: formatDate(item.date),
    formattedStartRepair: formatDate(item.startRepair),
    formattedFinishRepair: formatDate(item.finishRepair),
  }))
)

const handleExport = async (type: 'pdf' | 'excel', reportTruckId: string) => {
  try {
    await reportTruckStore.exportReportTruck(type, reportTruckId)
    successMessage.value = 'Sukses mengunduh data dalam bentuk ' + (type === 'pdf' ? 'PDF' : 'Excel') + '!'
    showSuccessDialog.value = true
  } catch (error) {
    errorMessage.value = 'Gagal mengunduh data dalam bentuk ' + (type === 'pdf' ? 'PDF' : 'Excel') + '!'
    showErrorDialog.value = true
  }
}
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Vehicle Maintenance Report List" />
      <div class="flex-1 p-4 overflow-auto bg-C8D9ED">
        <div class="container mx-auto max-w-7xl p-6 rounded shadow bg-white">
          <div class="flex justify-between items-center mb-4">
            <InputText v-model="filters.global.value" placeholder="Search Maintenance..." class="w-64" />
            <VButton class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="goToCreate">
              + Buat
            </VButton>
          </div>

          <DataTable
            :value="formattedReportList"
            paginator
            :rows="10"
            dataKey="reportTruckId"
            :loading="loading"
            :filters="filters"
            :globalFilterFields="['reportTruckId', 'vehiclePlateNo', 'formattedDate', 'formattedStartRepair', 'formattedFinishRepair']"
            stripedRows
            tableStyle="min-width: 100%"
            paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords} reports"
            class="custom-datatable"
          >
            <template #empty>Tidak ada data ditemukan.</template>
            <template #loading>Loading data. Please wait.</template>

            <Column header="No.">
              <template #body="{ index }">
                {{ index + 1 }}
              </template>
            </Column>

            <Column field="reportTruckId" header="ID" sortable />
            <Column field="vehiclePlateNo" header="Vehicle Plate No" sortable />
            <Column header="Date">
              <template #body="{ data }">
                {{ formatDate(data.date) }}
              </template>
            </Column>
            <Column header="Start Repair">
              <template #body="{ data }">
                {{ formatDate(data.startRepair) }}
              </template>
            </Column>
            <Column header="Finish Repair">
              <template #body="{ data }">
                {{ formatDate(data.finishRepair) }}
              </template>
            </Column>
            <Column header="Actions">
              <template #body="{ data }">
                <div class="flex justify gap-2 mb-4">
                  <VButton
                    title=".PDF"
                    icon="fas fa-file-pdf"
                    class="!px-3 !py-2 !text-s"
                    @click="handleExport('pdf', data.reportTruckId)">
                  </VButton>
                  <VButton
                    title=".XLSX"
                    icon="fas fa-file-excel"
                    class="!px-3 !py-2 !text-s"
                    @click="handleExport('excel', data.reportTruckId)">
                  </VButton>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <SuccessDialog
        :visible="showSuccessDialog"
        :message="successMessage"
        buttonText="Tutup"
        @close="showSuccessDialog = false"
      />
      <ErrorDialog
        :visible="showErrorDialog"
        :message="errorMessage"
        @close="showErrorDialog = false"
      />
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
  cursor: pointer;
}

.bg-C8D9ED {
  background-color: #C8D9ED;
}
</style>