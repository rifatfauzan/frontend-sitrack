<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import { useRouter } from 'vue-router';
import { useChassisStore } from '@/stores/chassis';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, onMounted } from 'vue';
import type { Chassis } from '@/interfaces/chassis.interfaces';

const router = useRouter();
const chassisStore = useChassisStore();

const { chassisList, loading } = storeToRefs(chassisStore);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  await chassisStore.fetchChassis();
});

const goToDetail = (event: { data: Chassis }) => {
  router.push({ name: 'detail chassis', query: { id: event.data.chassisId } });
};
</script>

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

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="List Chassis" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-6xl">
          <div class="card">
            <div class="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
              <span class="p-input-icon-left w-full lg:w-auto">
                <InputText v-model="filters.global.value" placeholder="Search Chassis..." class="w-full" />
              </span>
              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full lg:w-auto"
                @click="() => $router.push('/chassis/create')"
              />
            </div>

            <DataTable
              v-model:filters="filters"
              :value="chassisList"
              paginator
              :rows="10"
              datakey="chassisId"
              :rowsPerPageOptions="[5, 10, 20]"
              filterDisplay="menu"
              :loading="loading"
              selectionMode="single"
              :globalFilterFields="['chassisId', 'chassisSize', 'chassisYear', 'chassisAxle', 'chassisKIRNo']"
              stripedRows
              tableStyle="width: 100%"
              paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords} chassis"
              class="custom-datatable w-full"
              @rowSelect="goToDetail"
              :rowClass="() => 'clickable-row'"
            >
              <template #empty> No chassis found. </template>
              <template #loading> Loading chassis data. Please wait. </template>

              <Column header="No." style="width: 10%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>

              <Column field="chassisId" header="ID" sortable></Column>
              <Column field="chassisSize" header="Size" sortable></Column>
              <Column field="chassisYear" header="Year" sortable></Column>
              <Column field="chassisAxle" header="Axle" sortable></Column>
              <Column field="chassisKIRNo" header="No. KIR" sortable></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>
