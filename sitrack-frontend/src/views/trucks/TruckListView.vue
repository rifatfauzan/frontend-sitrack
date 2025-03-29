<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import { useRouter } from 'vue-router';
import { useTruckStore } from '@/stores/truck'; // Import store truck
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, onMounted } from 'vue';

const router = useRouter();
const truckStore = useTruckStore(); // Gunakan store truck

// Ambil state dari store
const { truckList, loading } = storeToRefs(truckStore);

const selectedRow = ref(null);

// Filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  vehicleId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  vehicleBrand: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  vehicleYear: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  vehiclePlateNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  vehicleKIRNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

// Fetch data truck saat komponen dimuat
onMounted(async () => {
  await truckStore.fetchTrucks(); // Ambil data dari API
});

// Navigasi ke halaman detail truck saat row diklik
const goToDetail = (event: { data: any }) => {
  router.push({ name: 'truck detail', query: { id: event.data.vehicleId } });
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

/* Tambahkan overflow-x agar tabel tidak terpotong */
.table-container {
  overflow-x: auto;
  white-space: auto;
}

</style>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="List Vehicle" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-full">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <span class="p-input-icon-left">
                <InputText v-model="filters.global.value" placeholder="Search Vehicle..." />
              </span>

              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                @click="() => $router.push('/trucks/create')"
              />
            </div>

            <div class="table-container">
              <DataTable
                v-model:filters="filters"
                v-model:selection="selectedRow"
                :value="truckList"
                paginator
                :rows="10"
                dataKey="vehicleId"
                filterDisplay="row"
                :loading="loading"
                :globalFilterFields="['vehicleId', 'vehicleBrand', 'vehiclePlateNo']"
                stripedRows
                tableStyle="width: 100%"
                paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
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

                <Column field="vehicleId" header="ID" style="width: 3rem" sortable >
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search ID..." />
                  </template>
                </Column>

                <Column field="vehicleBrand" header="Brand" style="width: 3rem" sortable>
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search Brand..." />
                  </template>
                </Column> 

                <Column field="vehiclePlateNo" header="Plat No" style="width: 3rem" sortable>
                  <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search Plat No..." />
                  </template>
                </Column>

              </DataTable>
            </div>

          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>