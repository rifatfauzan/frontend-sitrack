<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="List Customer" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-6xl">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <span class="p-input-icon-left">
                <InputText v-model="filters['global'].value" placeholder="Search Customer..." />
              </span>
              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                @click="() => $router.push('/customers/create')"
              />
            </div>

            <DataTable
              v-model:filters="filters"
              :value="sortedCustomers"
              paginator
              :rows="10"
              dataKey="id"
              filterDisplay="row"
              :loading="loading"
              :globalFilterFields="['name', 'id', 'address', 'siteId']"
              stripedRows
              tableStyle="min-width: 60rem"
              paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords} customers"
              class="custom-datatable"
              selectionMode="single"
              @rowSelect="goToDetail"
              :rowClass="() => 'clickable-row'"
            >
              <template #empty> Tidak ada customer yang ditemukan. </template>
              <template #loading> Loading data customer. Harap tunggu... </template>

              <Column header="No." style="width: 5%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Name" sortable></Column>
              <Column field="address" header="Address" sortable></Column>
              <Column field="siteId" header="Site ID" sortable></Column>

            </DataTable>
          </div>
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
  import { useCustomerStore } from '@/stores/customer';
  import { onMounted, ref, computed } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import { FilterMatchMode } from '@primevue/core/api';
  import router from '@/router';

  const customerStore = useCustomerStore();
  const loading = ref(true);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    address: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    siteId: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });

  onMounted(async () => {
    await customerStore.fetchCustomers();
    loading.value = false;
  });

  const sortedCustomers = computed(() => {
    return customerStore.customers.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  });

  const goToDetail = (event: { data: any }) => {
    router.push({ name: 'detail customers', query: { id: event.data.id } });
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
</style>