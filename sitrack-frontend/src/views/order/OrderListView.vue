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
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import { FilterMatchMode } from '@primevue/core/api';
import { format } from 'date-fns';
import { useCustomerStore } from '@/stores/customer';
import type { Order } from '@/interfaces/order.interfaces';
import Dropdown from 'primevue/dropdown'

const router = useRouter();
const orderStore = useOrderStore();
const { orderList: orders, loading } = storeToRefs(orderStore);

const customerStore = useCustomerStore();
const { customers } = storeToRefs(customerStore);

const selectedStatus = ref<null | number>(null)


onMounted(() => {
  orderStore.fetchOrders();
  customerStore.fetchCustomers();
});

function getCustomerNameById(customerId: string) {
  const name = customers.value.find(c => c.id === customerId)?.name || 'Unknown';
  return name.length > 18 ? name.slice(0, 18) + '...' : name;
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

function onRowClick(event: { data: Order }) {
  router.push({ name: 'detail order', query: { id: event.data.orderId } });
}

function formatDate(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

const statusMap = {
  0: { label: 'Rejected' },
  1: { label: 'Pending Approval' },
  2: { label: 'Needs Revision' },
  3: { label: 'Ongoing' },
  4: { label: 'Done' },
};

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Rejected', value: 0 },
  { label: 'Pending Approval', value: 1 },
  { label: 'Needs Revision', value: 2 },
  { label: 'Ongoing', value: 3 },
  { label: 'Done', value: 4 }
]

const filteredData = () => {
  if (selectedStatus.value === null) return orders.value;
  return orders.value.filter(item => item.orderStatus === selectedStatus.value);
};


</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Booking Order" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-6xl">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-4">
                  <InputText v-model="filters.global.value" placeholder="Search Order..." />
                  <Dropdown
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Filter Status"
                    class="w-60"
                  />
                </div>

              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                @click="() => router.push({ name: 'create order' })"
              />
            </div>

            <DataTable
              v-model:filters="filters"
              :value="filteredData()"
              :loading="loading"
              datakey="orderId"
              filterDisplay="menu"
              selectionMode="single"
              :globalFilterFields="['orderId', 'customerId']"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              paginator
              stripedRows
              tableStyle="min-width: 60rem"
              paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords} orders"
              class="custom-datatable"
              @rowSelect="onRowClick"
              :rowClass="() => 'clickable-row'"
            >
              <template #empty> No orders found. </template>
              <template #loading> Loading order data. Please wait. </template>

              <Column header="No." style="width: 5%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>

              <Column field="orderId" header="ID" sortable />
              <!-- <Column field="customerId" header="Customer" sortable /> -->

              <Column header="Customer" sortable>
                <template #body="{ data }">
                  {{ getCustomerNameById(data.customerId) }}
                </template>
              </Column>

              <Column field="orderDate" header="Date" sortable>
                <template #body="{ data }">
                  {{ formatDate(data.orderDate) }}
                </template>
              </Column>
              <Column
                field="orderStatus"
                header="Status"
                sortable
                :filter="true"
                :filterMatchMode="'equals'"
                :showFilterMenu="false"
                :filterElement="statusFilterTemplate"
              >
                <template #body="{ data }">
                  <span
                    class="status-pill px-3 py-1 rounded font-semibold text-sm"
                    :class="{
                      'bg-[#EB5757] text-white': data.orderStatus === 0,
                      'bg-[#639FAB] text-white': data.orderStatus === 1,
                      'bg-[#F7B500] text-black': data.orderStatus === 2,
                      'bg-[#27AE60] text-white': data.orderStatus === 3,
                      'bg-[#1C5D99] text-white': data.orderStatus === 4
                    }"
                  >
                    {{ statusMap[data.orderStatus]?.label || 'Unknown' }}
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
