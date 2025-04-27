<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Vehicle Out" />
        <div class="flex-1 p-4 main-content overflow-auto">
          <div class="container mx-auto max-w-6xl">
            <div class="card">
              <div class="flex justify-between items-center mb-4">
                <span class="p-input-icon-left">
                  <InputText v-model="filters.global.value" placeholder="Search SPJ..." />
                </span>
                <VButton
                  title="+ Buat"
                  class="bg-[#1C5D99] text-white px-4 py-2 rounded"
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
                tableStyle="min-width: 60rem"
                paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords} SPJ"
                stripedRows
                class="custom-datatable"
              >
                <template #empty> Tidak ada SPJ Vehicle Out yang ditemukan. </template>
                <template #loading> Memuat data SPJ... </template>
  
                <Column header="No." style="width: 5%">
                  <template #body="{ index }">
                    <div class="text-center">{{ index + 1 }}</div>
                  </template>
                </Column>
                <Column field="id" header="ID" sortable />
                <Column field="orderId" header="Order ID" sortable />
                <Column field="customerId" header="Customer" sortable />
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
  import Sidebar from '@/components/Sidebar.vue';
  import HeaderComponent from '@/components/Header.vue';
  import FooterComponent from '@/components/Footer.vue';
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
  
  const router = useRouter();
  const spjStore = useSpjStore();
  const { spjList, loading } = storeToRefs(spjStore);
  
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  
  onMounted(() => {
    spjStore.fetchAllSpjVehicleOut();
  });
  
  const statusMap: Record<number, string> = {
    0: 'Rejected',
    1: 'Pending Approval',
    2: 'Needs Revision',
  };
  
  const filteredSpjOut = computed(() =>
    spjList.value.filter(spj => [0, 1, 2].includes(spj.status))
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
  </style>
  