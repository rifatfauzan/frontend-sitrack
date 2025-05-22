<template>
  <div class="flex h-screen">
    <vSidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <vHeader title="Simpan Laporan Trucking" />
      <div class="flex-1 p-4 main-content overflow-auto bg-[#E6F0FA]">
        <div class="max-w-8xl mx-auto">
          <div class="card max-w-6xl p-6 rounded-lg shadow bg-white mx-auto">
            <div class="flex flex-col md:flex-row gap-4 mb-6">
              <div class="flex-1 flex flex-col gap-2">
                <label class="font-semibold">Pilih Data</label>
                <select
                  v-model="reportingStore.reportType"
                  class="p-3 rounded-md bg-[#BBCDE5] text-lg text-gray-800 border border-gray-300"
                >
                  <option v-for="option in reportTypes" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="flex-1 flex flex-col gap-2" v-if="showDateFilter">
                <label class="font-semibold">Tanggal Awal</label>
                <input
                  type="date"
                  v-model="reportingStore.fromDate"
                  class="p-3 rounded-md bg-[#BBCDE5] text-lg text-gray-800 border border-gray-300"
                />
              </div>
              <div class="flex-1 flex flex-col gap-2" v-if="showDateFilter">
                <label class="font-semibold">Tanggal Akhir</label>
                <input
                  type="date"
                  v-model="reportingStore.endDate"
                  class="p-3 rounded-md bg-[#BBCDE5] text-lg text-gray-800 border border-gray-300"
                />
              </div>
              <div class="flex items-end">
                <VButton :title="'Load'" @click="loadReport" :disabled="reportingStore.loading" />
              </div>
            </div>

            <div class="flex justify-end gap-2 mb-4">
              <VButton
                title="Save as .PDF"
                icon="fas fa-file-pdf"
                @click="() => handleExport('pdf')"
                :disabled="!reportingStore.data.length || reportingStore.loading"
              />
              <VButton
                title="Save as .XLSX"
                icon="fas fa-file-excel"
                @click="() => handleExport('excel')"
                :disabled="!reportingStore.data.length || reportingStore.loading"
              />
            </div>

            <div v-if="reportingStore.loading" class="text-center py-8 text-lg">
              Loading data...
            </div>

            <div v-if="reportingStore.data.length" class="relative">
              <div class="w-full overflow-x-auto">
                <DataTable
                  :value="reportingStore.data"
                  :rows="10"
                  paginator
                  :rowsPerPageOptions="[5, 10, 20]"
                  class="custom-datatable"
                  :tableStyle="'min-width: 60rem'"
                  paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                  currentPageReportTemplate="{first} to {last} of {totalRecords} Reports"
                >
                  <Column
                    v-for="col in reportingStore.columns"
                    :key="col"
                    :field="col"
                    :header="col"
                  />
                </DataTable>
              </div>
            </div>

            <div v-else class="text-center py-8 text-lg">Tidak ada data ditemukan.</div>

            <div v-if="reportingStore.error" class="text-red-600 text-center mt-4">
              {{ reportingStore.error }}
            </div>
          </div>
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
      <vFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useReportingStore } from '@/stores/reporting'
import vSidebar from '@/components/vSidebar.vue'
import vHeader from '@/components/vHeader.vue'
import vFooter from '@/components/vFooter.vue'
import VButton from '@/components/VButton.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import SuccessDialog from '@/components/SuccessDialog.vue'
import ErrorDialog from '@/components/ErrorDialog.vue'

const reportingStore = useReportingStore()

const showSuccessDialog = ref(false)
const showErrorDialog = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const reportTypes = [
  { label: 'All Customers', value: 'ALL_CUSTOMERS' },
  { label: 'All Vehicles', value: 'ALL_VEHICLES' },
  { label: 'All Chassis', value: 'ALL_CHASSIS' },
  { label: 'All Drivers', value: 'ALL_DRIVERS' },
  { label: 'All Commissions', value: 'ALL_COMMISSIONS'},
  { label: 'All Orders', value: 'ALL_ORDERS' },
  { label: 'All SPJ', value: 'ALL_SPJ' },
]

const showDateFilter = computed(
  () => reportingStore.reportType === 'ALL_ORDERS' || reportingStore.reportType === 'ALL_SPJ',
)

function loadReport() {
  reportingStore.fetchReport()
}

async function handleExport(type: 'pdf' | 'excel') {
  try {
    await reportingStore.exportReport(type)
    successMessage.value = `Sukses mengunduh data dalam bentuk ${type === 'pdf' ? 'PDF' : 'Excel'}!`
    showSuccessDialog.value = true
  } catch {
    errorMessage.value = `Gagal mengunduh data dalam bentuk ${type === 'pdf' ? 'PDF' : 'Excel'}!`
    showErrorDialog.value = true
  }
}

watch(
  () => reportingStore.reportType,
  () => {},
)
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.custom-datatable :deep(.p-datatable-thead > tr > th) {
  background: #1c5d99;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
}

.custom-datatable :deep(.p-datatable-tbody > tr:nth-child(even)) {
  background: #bbcde5;
}

.custom-datatable :deep(.p-datatable-tbody > tr:nth-child(odd)) {
  background: #e6f0fa;
}
</style>
