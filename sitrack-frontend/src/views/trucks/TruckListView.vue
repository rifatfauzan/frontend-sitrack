<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import { useTruckStore } from '@/stores/truck';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';

const router = useRouter();
const truckStore = useTruckStore();

const { truckList, loading } = storeToRefs(truckStore);

interface Truck {
  vehicleId: string;
  vehicleBrand: string;
  vehiclePlateNo: string;
}

const selectedRow = ref<Truck | null>(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
  await truckStore.fetchTrucks();
});

const goToDetail = (event: { data: Truck }) => {
  router.push({ name: 'truck detail', query: { id: event.data.vehicleId } });
};

const goToCreateTruck = () => {
  router.push('/trucks/create');
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen lg:ml-0">
      <HeaderComponent title="List Vehicle" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-full">
          <div class="card">
            <div class="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
              <span class="p-input-icon-left w-full lg:w-auto">
                <InputText
                  v-model="filters.global.value"
                  placeholder="Search Vehicle..."
                  class="w-full"
                />
              </span>

              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full lg:w-auto"
                @click="goToCreateTruck"
              />
            </div>

            <div class="table-container">
              <DataTable
                v-model:filters="filters"
                v-model:selection="selectedRow"
                :value="truckList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                dataKey="vehicleId"
                filterDisplay="row"
                :loading="loading"
                :globalFilterFields="['vehicleId', 'vehicleBrand', 'vehiclePlateNo']"
                stripedRows
                tableStyle="width: 100%"
                paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords} vehicles"
                class="custom-datatable"
                selectionMode="single"
                @rowSelect="goToDetail"
                :rowClass="() => 'clickable-row'"
              >
                <template #empty> No vehicles found. </template>
                <template #loading> Loading vehicle data. Please wait. </template>

                <Column header="No." style="width: 5%">
                  <template #body="{ index }">
                    <div class="text-center">{{ index + 1 }}</div>
                  </template>
                </Column>

                <Column field="vehicleId" header="ID" style="width: 6rem" sortable />

                <Column field="vehicleBrand" header="Brand" style="width: 6rem" sortable />

                <Column field="vehiclePlateNo" header="Plate No" style="width: 6rem" sortable />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
::v-deep(.p-inputtext) {
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

.table-container {
  overflow-x: auto;
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .table-container {
    margin: 0 -1rem;
    padding: 0 1rem;
  }

  :deep(.p-datatable) {
    font-size: 0.9rem;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.5rem;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.5rem;
  }

  .card {
    padding: 1rem;
  }
}

@media screen and (max-width: 480px) {
  .table-container {
    margin: 0 -0.5rem;
    padding: 0 0.5rem;
  }

  :deep(.p-datatable) {
    font-size: 0.8rem;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    padding: 0.4rem;
  }

  :deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 0.4rem;
  }

  .card {
    padding: 0.5rem;
  }
}
</style>
