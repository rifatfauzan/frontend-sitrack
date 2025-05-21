<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { FilterMatchMode } from '@primevue/core/api';
import { format } from 'date-fns';

import { useKomisiStore } from '@/stores/komisi';
import { useTruckStore } from '@/stores/truck';
import type { Komisi } from '@/interfaces/komisi.interface';

const router = useRouter();
const komisiStore = useKomisiStore();
const { komisiList: komisi, loading } = storeToRefs(komisiStore);

const truckStore = useTruckStore();
const { truckList } = storeToRefs(truckStore);



onMounted(() => {
    komisiStore.fetchKomisi();
    truckStore.fetchTrucks();
});

function getTruckNameById(truckId: string) {
  const name = truckList.value.find(c => c.vehicleId === truckId)?.vehicleBrand || 'Unknown';
  return name.length > 18 ? name.slice(0, 18) + '...' : name;
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});


function formatDate(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

const goToDetail = (event: { data: {komisiId: string} }) => {
  router.push({ name: 'detail komisi', params: { komisiId: event.data.komisiId } });
};


</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Commission" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-6xl">
          <div class="card">
            <div class="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
              <span class="p-input-icon-left w-full lg:w-auto">
                <InputText v-model="filters.global.value" placeholder="Search Komisi..." class="w-full" />
              </span>
              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full lg:w-auto"
                @click="() => router.push({ name: 'create komisi' })"
              />
            </div>

            <DataTable 
                :value="komisiStore.komisiList" 
                v-model:filters="filters"
                paginator 
                :rows="10" 
                dataKey="komisiId"
                filterDisplay="row"
                :loading="komisiStore.loading"
                :rowsPerPageOptions="[5, 10, 20]" 
                :globalFilterFields="['komisiId', 'location', ]"
                stripedRows
                tableStyle="width: 100%"
                paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords} Commissions"
                class="custom-datatable w-full"
                @row-click= "goToDetail"
            >
              <template #empty> No commission found. </template>
              <template #loading> Loading commission data. Please wait. </template>

              <Column header="No." style="width: 10%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>

              <Column field="komisiId" header="Commission ID" sortable />

              <Column header="Vehicle ID" sortable>
                <template #body="{ data }">
                  {{ getTruckNameById(data.truckId) }}
                </template>
              </Column>

              <Column header="Vehicle Brand" sortable>
                <template #body="{ data }">
                  {{ data.truckId }}
                </template>
              </Column>

              <Column field="location" header="Location" sortable />
            </DataTable>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-inputtext) {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
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
  max-width: 120px;
}

@media (max-width: 768px) {
  :deep(.p-datatable .p-datatable-thead > tr > th),
  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    font-size: 0.9rem;
    max-width: 80px;
    padding: 6px 4px;
  }
}

</style>
