<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { FilterMatchMode } from '@primevue/core/api'
import { useRequestAssetStore } from '@/stores/requestAsset'
import Sidebar from '@/components/vSidebar.vue'
import HeaderComponent from '@/components/vHeader.vue'
import FooterComponent from '@/components/vFooter.vue'
import VButton from '@/components/VButton.vue'
import InputText from 'primevue/inputtext'
import DataTable, { type DataTableRowSelectEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'

const router = useRouter()
const requestAssetStore = useRequestAssetStore()
const { requestAssetList, loading } = storeToRefs(requestAssetStore)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const selectedStatus = ref<null | number>(null)

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Pending Approval', value: 0 },
  { label: 'Approved', value: 1 },
  { label: 'Needs Revision', value: 2 },
  { label: 'Rejected', value: 3 }
]

onMounted(async () => {
  await requestAssetStore.fetchRequestAssets()
})

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0: return 'Pending Approval'
    case 1: return 'Approved'
    case 2: return 'Needs Revision'
    case 3: return 'Rejected'
    default: return 'Unknown'
  }
}

const getStatusColorClass = (status: number) => {
  switch (status) {
    case 0: return 'bg-[#639FAB] text-white';      
    case 1: return 'bg-[#27AE60] text-white';      
    case 2: return 'bg-[#F7B500] text-black';      
    case 3: return 'bg-[#EB5757] text-white';      
    default: return 'bg-[#27AE60] text-white';    
  }
};

const goToDetail = (event: DataTableRowSelectEvent) => {
  router.push({ path: '/request-assets/detail', query: { id: event.data.requestAssetId } })
}

const filteredData = () => {
  if (selectedStatus.value === null) return requestAssetList.value
  return requestAssetList.value.filter(item => item.status === selectedStatus.value)
}
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen bg-[#C8D9ED]">
      <HeaderComponent title="List Request Asset" />
      <div class="flex-1 p-4 overflow-auto">
        <div class="container mx-auto max-w-7xl">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-4">
                  <InputText v-model="filters.global.value" placeholder="Search Request Asset..." />
                  <Dropdown
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Filter Status"
                    class="w-60"
                  />
                </div>

              <VButton title="+ Buat" class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="() => router.push('/request-assets/create')" />
            </div>

            <DataTable
              v-model:filters="filters"
              :value="filteredData()"
              paginator
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              dataKey="requestAssetId"
              filterDisplay="menu"
              :loading="loading"
              selectionMode="single"
              :globalFilterFields="['requestAssetId']"
              stripedRows
              tableStyle="min-width: 100%"
              paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords} requests"
              class="custom-datatable"
              @rowSelect="goToDetail"
              :rowClass="() => 'clickable-row'"
            >
              <template #empty>No request asset found.</template>
              <template #loading>Loading request assets. Please wait.</template>

              <Column header="No." style="width: 5%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>

              <Column field="requestAssetId" header="ID" sortable></Column>
              <Column field="status" header="Status" sortable>
                <template #body="{ data }">
                  <span
                      class="status-pill px-3 py-1 rounded font-semibold text-sm"
                      :class="getStatusColorClass(data.status)"
                    >
                      {{ getStatusLabel(data.status) }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th {
  background-color: #1C5D99;
  color: white;
  padding: 8px;
  text-align: center;
}
td, th {
  border: 1px solid #ccc;
  padding: 8px;
}
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
  cursor: pointer;
}
.bg-c8d9ed {
  background-color: #C8D9ED;
}
</style>
