<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import { useSopirStore } from '@/stores/sopir';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode} from '@primevue/core/api';
import router from '@/router';

const sopirStore = useSopirStore();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const columns = ref([
    { field: 'driverName', header: 'Nama' },
    { field: 'driverId', header: 'ID' },
    {field: 'driverJoinDate', header: 'Join Year'},
    {field: 'driver_SIM_No', header: 'No. SIM'},
    {field: 'driver_KTP_No', header: 'No. KTP'},
]);

const formatDriverId = (driverId: string) => {
  return (driverId);
};

const formatJoinDate = (joinDate: string) => {
  const date = new Date(joinDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if month is single digit
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
  return `${year}-${month}-${day}`;
};

const goToDetail = (event: { data: { driverId: string } }) => {
  router.push({ name: 'detail sopir', params: { driverId: event.data.driverId } });
};

onMounted(async () => {
    await sopirStore.fetchSopirs();
});
</script>

<style scoped>
.p-inputtext {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.5rem;
}

.p-input-icon-left > i {
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.p-input-icon-left > .p-inputtext {
    padding-left: 2rem;
}
</style>


<template>
    <div class="flex h-screen">
        <Sidebar />

        <div class="flex-1 flex flex-col min-h-screen">
            <HeaderComponent title="List Driver" />
            <div class="flex-1 p-4 main-content overflow-auto">
                <div class="container mx-auto max-w-4xl">
                    <div class="flex justify-between items-center mb-4">
                        <span class="p-input-icon-left">
                            <InputText v-model="filters.global.value" placeholder="Search Driver" />
                        </span>
                        <VButton 
                            title="+ Buat" 
                            class="bg-[#1C5D99] text-white px-4 py-2 rounded" 
                            @click="() => $router.push('/sopir/add')" 
                        />
                    </div>

                    <DataTable 
                        :value="sopirStore.sopirs" 
                        v-model:filters="filters"
                        paginator 
                        :rows="10" 
                        datakey="driverId"
                        filterDisplay="row"
                        :loading="sopirStore.loading"
                        :rowsPerPageOptions="[5, 10, 20]" 
                        :globalFilterFields="['driverName', 'driverId', 'driverJoinDate', 'driver_SIM_No', 'driver_KTP_No']"

                        stripedRows
                        tableStyle="min-width: 50rem"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords} Drivers"
                        class="custom-datatable"
                        @row-click= "goToDetail"
                    >
                        <template #empty>No driver found.</template>
                        <template #loading>Loading driver data. Please wait.</template>
                        
                        <Column header="No." style="width: 5%">
                            <template #body="{ index }">
                                <div class="text-center">{{ index + 1 }}</div>
                            </template>
                        </Column>
                        
                        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable>
                            <template #body="{ data }">
                                <div v-if="col.field === 'driverId'" sortable>
                                    {{ formatDriverId(data.driverId) }}
                                </div>
                                <div v-else-if="col.field === 'driverJoinDate'" sortable>
                                    {{ formatJoinDate(data.driverJoinDate) }}
                                </div>
                                <div v-else sortable>
                                    {{ data[col.field] }}
                                </div>
                            </template>
                        </Column>
                        
                    </DataTable>
                </div>
            </div>
            <FooterComponent />
        </div>
    </div>
</template>


