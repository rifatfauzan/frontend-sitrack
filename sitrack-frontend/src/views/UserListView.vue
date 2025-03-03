<template>
    <div class="flex h-screen">
        <Sidebar />

        <div class="flex-1 flex flex-col min-h-screen">
            <HeaderComponent title="List Pengguna" />
            <div class="flex-1 p-4 main-content overflow-auto">
                <div class="container mx-auto max-w-4xl">
                    <div class="flex justify-between items-center mb-4">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" style="font-size: 0.8rem" />
                            <InputText v-model="filters['global'].value" placeholder="Search Pengguna" />
                        </span>
                        <VButton 
                            title="+ Buat" 
                            class="bg-[#1C5D99] text-white px-4 py-2 rounded" 
                            @click="() => $router.push('/users/create')" 
                        />
                    </div>

                    <DataTable 
                        :value="userStore.users" 
                        v-model:filters="filters"
                        paginator 
                        :rows="10" 
                        :rowsPerPageOptions="[5, 10, 20]" 
                        dataKey="id"
                        :globalFilterFields="['username', 'role']"
                        stripedRows
                        tableStyle="min-width: 50rem"
                        paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                        currentPageReportTemplate="{first} to {last}"
                        class="custom-datatable"
                    >
                        <template #empty>No users found.</template>
                        <template #loading>Loading users data. Please wait.</template>
                        
                        <Column header="No." style="width: 5%; text-align: center">
                            <template #body="{ index }">
                                <div class="text-center">{{ index + 1 }}</div>
                            </template>
                        </Column>
                        
                        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"></Column>
                        
                        <Column style="width: 10%;">
                            <template #body="slotProps">
                                <div class="flex justify-center">
                                    <VButton title="Edit" class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                                         @click="() => $router.push({ name: 'edit users', query: { id: slotProps.data.id } })" />
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

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const columns = ref([
    { field: 'username', header: 'Username' },
    { field: 'role', header: 'Role' }
]);

onMounted(async () => {
    await userStore.fetchUsers();
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
