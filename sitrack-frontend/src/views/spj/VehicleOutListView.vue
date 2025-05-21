<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Vehicle Out" />
        <div class="flex-1 p-4 main-content overflow-auto">
          <div class="container mx-auto max-w-6xl">
            <div class="card">
              <div class="flex flex-col lg:flex-row justify-between items-center mb-4 gap-4">
                <div class="flex flex-col lg:flex-row gap-3 items-center w-full lg:w-auto">
                  <span class="p-input-icon-left w-full lg:w-auto">
                    <InputText v-model="filters.global.value" placeholder="Search SPJ..." class="w-full" />
                  </span>
                  <Dropdown
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Filter Status"
                    class="w-full lg:w-60"
                  />
                </div>
                <VButton
                  title="+ Buat"
                  class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full lg:w-auto"
                  @click="() => router.push({ name: 'create spj' })"
                />
              </div>
  
              <DataTable
                v-model:filters="filters"
                :value="filteredSpjOut"
                paginator
                :rows="10"
                :loading="loading"
                :globalFilterFields="['id', 'orderId', 'customerId']"
                :rowsPerPageOptions="[5, 10, 20]"
                filterDisplay="menu"
                dataKey="id"
                selectionMode="single"
                @rowSelect="onRowClick"
                :rowClass="() => 'clickable-row'"
                tableStyle="width: 100%"
                paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords} SPJ"
                stripedRows
                class="custom-datatable w-full"
              >
                <template #empty> Tidak ada SPJ Vehicle Out yang ditemukan. </template>
                <template #loading> Memuat data SPJ... </template>
  
                <Column header="No." style="width: 10%">
                  <template #body="{ index }">
                    <div class="text-center">{{ index + 1 }}</div>
                  </template>
                </Column>
                <Column field="id" header="ID" sortable />
                <Column field="orderId" header="Order ID" sortable />
                <Column header="Customer" sortable>
                  <template #body="{ data }">
                  {{ getCustomerNameById(data.customerId) }}
                  </template>
                </Column>
                <Column header="Status">
                    <template #body="{ data }">
                        <span
                        class="status-pill px-3 py-1 rounded font-semibold text-sm"
                        :class="{
                            'bg-[#EB5757] text-white': data.status === 0, // Rejected
                            'bg-[#639FAB] text-white': data.status === 1, // Pending Approval
                            'bg-[#F7B500] text-black': data.status === 2  // Needs Revision
                        }"
                        >
                        {{ statusMap[data.status] || 'Unknown' }}
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
  
  <script setup lang="ts">
  import Sidebar from '@/components/vSidebar.vue';
  import HeaderComponent from '@/components/vHeader.vue';
  import FooterComponent from '@/components/vFooter.vue';
  import VButton from '@/components/VButton.vue';
  import InputText from 'primevue/inputtext';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import { ref, onMounted, computed } from 'vue';
  import { useSpjStore } from '@/stores/spj';
  import { storeToRefs } from 'pinia';
  import { FilterMatchMode } from '@primevue/core/api';
  import { useRouter } from 'vue-router';
  import type { Spj } from '@/interfaces/spj.interfaces';
  import { useCustomerStore } from '@/stores/customer';
  import Dropdown from 'primevue/dropdown';
  
  const router = useRouter();
  const spjStore = useSpjStore();
  const { spjList, loading } = storeToRefs(spjStore);
  const customerStore = useCustomerStore();
  const { customers } = storeToRefs(customerStore);
  
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  
  onMounted(() => {
    spjStore.fetchAllSpjVehicleOut();
    customerStore.fetchCustomers();
  });

  function getCustomerNameById(customerId: string): string {
    const customer = customers.value.find(c => c.id === customerId);
    return customer?.name || 'Unknown';
  }
  
  const statusMap: Record<number, string> = {
    0: 'Rejected',
    1: 'Pending Approval',
    2: 'Needs Revision',
  };
  
  // const filteredSpjOut = computed(() =>
  //   spjList.value.filter(spj => [0, 1, 2].includes(spj.status))
  // );

  const selectedStatus = ref<number | null>(null);

  const statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Rejected', value: 0 },
    { label: 'Pending Approval', value: 1 },
    { label: 'Needs Revision', value: 2 },
  ];

  const filteredSpjOut = computed(() =>
    spjList.value.filter(spj =>
      (selectedStatus.value === null || spj.status === selectedStatus.value) &&
      [0, 1, 2].includes(spj.status)
    )
  );

  
  const onRowClick = (event: { data: Spj }) => {
    router.push({ name: 'detail spj', query: { id: event.data.id } });
  };
  </script>
  
  <style scoped>
  .clickable-row {
    cursor: pointer;
  }
  .clickable-row:hover {
    background-color: #f3f4f6 !important;
  }

  .status-pill {
    display: inline-block;
    padding: 0.5rem 0.75rem;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 9999px;
    text-align: center;
    white-space: nowrap;
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
  