<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { useCustomerStore } from '@/stores/customer';

import ApprovalDialog from '@/components/ApprovalDialog.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import type { Order } from '@/interfaces/order.interfaces';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const { loading } = storeToRefs(orderStore);
const orderDetail = ref<Order>();

const customerStore = useCustomerStore();
const { customers } = storeToRefs(customerStore);

const orderId = route.query.id as string;

onMounted(async () => {
  customerStore.fetchCustomers(); // <-- ini dia

  if (orderId) {
    orderDetail.value = await orderStore.getOrderById(orderId);
  }
});

const goBack = () => {
  router.push('/orders');
};

const goToEdit = () => {
  if (orderDetail.value?.orderId) {
    router.push({ name: 'edit order', query: { id: orderDetail.value.orderId } });
  }
};

function getCustomerNameById(customerId: string) {
  const name = customers.value.find(c => c.id === customerId)?.name || 'Unknown';
  return name.length > 30 ? name.slice(0, 30) + '...' : name;
}

const formatRupiah = (angka: number | string) => {
  if (!angka) return "Rp0,00";
  const rupiah = angka.toString().replace(/[^,\d]/g, "");
  const split = rupiah.split(",");
  const sisa = split[0].length % 3;
  let rupiahFormatted = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiahFormatted += separator + ribuan.join(".");
  }

  rupiahFormatted = split[1] ? rupiahFormatted + "," + split[1] : rupiahFormatted;
  return "Rp" + rupiahFormatted;
};

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
  return formattedDate;
};

const statusMap = {
  0: { label: 'Rejected', class: 'bg-[#EB5757] text-white' },
  1: { label: 'Pending Approval', class: 'bg-[#639FAB] text-white' },
  2: { label: 'Needs Revision', class: 'bg-[#F7B500] text-black' },
  3: { label: 'Ongoing', class: 'bg-[#27AE60] text-white' },
  4: { label: 'Done', class: 'bg-white text-[#1C5D99]' },
};

const statusLabel = computed(() => {
  const status = orderDetail.value?.orderStatus;
  return statusMap[status] || { label: 'Unknown', class: 'bg-gray-300 text-black' };
});

const showApprovalDialog = ref(false);
const selectedApprovalAction = ref('');
const approvalRemarks = ref('');
const showConfirmation = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');
const showDoneConfirmation = ref(false);

const getCurrentUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch {
    return null;
  }
};

const userRole = ref(getCurrentUserRole());

const handleOpenApproval = () => {
  showApprovalDialog.value = true;
};

const handleApprovalAction = (action: string, remarks: string) => {
  selectedApprovalAction.value = action;
  approvalRemarks.value = remarks;
  showApprovalDialog.value = false;
  showConfirmation.value = true;
};

const confirmApproval = async () => {
  showConfirmation.value = false;
  try {
    if (!selectedApprovalAction.value) {
      throw new Error('Action approval tidak valid.');
    }

    let status: number;
    if (selectedApprovalAction.value === 'approve') status = 3;
    else if (selectedApprovalAction.value === 'revision') status = 2;
    else if (selectedApprovalAction.value === 'reject') status = 0;
    else throw new Error('Action tidak dikenali');

    await orderStore.approveOrder({
      orderId: orderDetail.value?.orderId || '',
      remarksSupervisor: approvalRemarks.value,
      orderStatus: status,
    });

    showSuccess.value = true;
  } catch (error) {
    errorMessage.value = (error as Error).message || 'Gagal melakukan approval Order.';
    showError.value = true;
  }
};

const loadCatalog: Record<
  string,
  { chassis: 20 | 40; field: string; containerType: string }
> = {
  '120MTFL': { chassis: 20, field: 'qty120mtfl',  containerType: '120MTFL' },
  '120MT'  : { chassis: 20, field: 'qty120mt',    containerType: '120MT'   },
  'CH120FL': { chassis: 20, field: 'qtyCh120fl',  containerType: 'CH120FL' },
  
  '220MTFL':     { chassis: 40, field: 'qty220mtfl',     containerType: '220MTFL' },
  '220MT':       { chassis: 40, field: 'qty220mt',       containerType: '220MT'   },
  '140MTFL':     { chassis: 40, field: 'qty140mtfl',     containerType: '140MTFL' },
  '140MT':       { chassis: 40, field: 'qty140mt',       containerType: '140MT'   },
  '120MT120FL':  { chassis: 40, field: 'qty120mt120fl',  containerType: '120MT120FL' },
  '120MT220FL':  { chassis: 40, field: 'qty120mt220fl',  containerType: '120MT220FL' },
  '120MT140FL':  { chassis: 40, field: 'qty120mt140fl',  containerType: '120MT140FL' },
  '220MT120FL':  { chassis: 40, field: 'qty220mt120fl',  containerType: '220MT120FL' },
  '220MT220FL':  { chassis: 40, field: 'qty220mt220fl',  containerType: '220MT220FL' },
  'CH140FL':     { chassis: 40, field: 'qtyCh140fl',     containerType: 'CH140FL'   },
  'CH220FL':     { chassis: 40, field: 'qtyCh220fl',     containerType: 'CH220FL'   },
  '145MT':       { chassis: 40, field: 'qty145mt',       containerType: '145MT'     },
  '145FL':       { chassis: 40, field: 'qty145fl',       containerType: '145FL'     },
  '145MTFL':     { chassis: 40, field: 'qty145mtfl',     containerType: '145MTFL'   },
};

const goToDetail = () => {
  router.go(0);
};

const filteredLoads = computed(() => {
  if (!orderDetail.value) return []
  return Object.entries(loadCatalog)
    .filter(([code, { field }]) => (orderDetail.value![field] ?? 0) > 0)
    .map(([code, { field }]) => ({
      code,
      qty: orderDetail.value![field] as number
    }))
})

const nonRejectedSpjs = computed(() => {
  if (!orderDetail.value) return []
  return orderDetail.value.spjList.filter(spj => spj.status !== 0)
})

const canMarkAsDone = computed(() => {
  const order = orderDetail.value
  if (!order) return false

  const spjs = nonRejectedSpjs.value
  const totalChassis = (order.qtyChassis20 || 0) + (order.qtyChassis40 || 0)

  const allDone = spjs.every(s => s.status === 4)

  return order.orderStatus === 3
      && spjs.length === totalChassis
      && allDone
})


const markOrderAsDone = async () => {
  if (orderDetail.value?.orderId) {
    const result = await orderStore.markOrderAsDone(orderDetail.value.orderId);
    if (result.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = result.message;
      showError.value = true;
    }
  }
};

const containerTariffs = computed(() => {
  if (!orderDetail.value) return [];

  const cust = customers.value.find(c => c.id === orderDetail.value!.customerId);
  if (!cust) return [];

  return filteredLoads.value.map(l => {
    const meta = loadCatalog[l.code];
    const tariffObj = cust.tariffs.find(
      t =>
        t.moveType.toLowerCase() === orderDetail.value!.moveType.toLowerCase() &&
        t.chassisSize === meta.chassis &&
        t.containerType === meta.containerType
    );
    const tariff = tariffObj?.stdTariff ?? 0; 
    return {
      containerType: meta.containerType,
      chassisSize:   meta.chassis,
      quantity:      l.qty,
      tariff,
      total:         tariff * l.qty,
    };
  });
});


const grandTotalTariff = computed(() =>
  containerTariffs.value.reduce((s, r) => s + r.total, 0)
);


</script>

<template>
    <div class="flex h-screen overflow-auto">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Detail Order" />
  
        <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
          <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
          </div>
  
          <div v-else-if="orderDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">

                <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                </VButton>
                <div>
                    <h1 class="text-2xl font-bold">{{ orderDetail.orderId }}</h1>
                    <p class="text-sm">
                    <span
                        class="status-pill px-3 py-1 rounded font-semibold text-sm"
                        :class="statusLabel.class"
                    >
                        {{ statusLabel.label }}
                    </span>
                    </p>

                </div>
              </div>
              <div class="flex gap-2">
                <VButton
                  v-if="userRole && ['Supervisor', 'Manager', 'Admin'].includes(userRole) && [1].includes(orderDetail?.orderStatus)"
                  title="Approve"
                  class="bg-[#639FAB] text-white px-4 py-2 rounded shadow-md"
                  @click="handleOpenApproval"
                />

                <VButton 
                v-if="orderDetail?.orderStatus === 1 || orderDetail?.orderStatus === 2"
                title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" 
                @click="goToEdit" 
                />

                <!-- <VButton
                v-if="canMarkAsDone"
                title="Mark as Done"
                class="bg-[#639FAB] text-white px-4 py-2 rounded shadow-md"
                @click="markOrderAsDone"
              /> -->

              <VButton
                v-if="canMarkAsDone"
                title="Mark as Done"
                class="bg-[#639FAB] text-white px-4 py-2 rounded shadow-md"
                @click="showDoneConfirmation = true"
              />
              </div>
            </div>

            <div class="mt-2">
              <h2 class="text-base font-semibold mb-2">Vehicle Expedition</h2>
              <div class="overflow-x-auto bg-[#FAFAFF] rounded-lg shadow-sm">
                <table class="min-w-full text-sm text-left">
                  <thead class="bg-[#1C5D99] text-white">
                    <tr>
                      <th class="px-4 py-3">SPJ ID</th>
                      <th class="px-4 py-3">Chassis Size</th>
                      <th class="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="spj in nonRejectedSpjs" :key="spj.id">
                      <td class="px-4 py-2">{{ spj.id }}</td>
                      <td class="px-4 py-2">{{ spj.chassisSize }}</td>
                      <td class="px-4 py-2">
                        <span
                          class="status-pill"
                          :class="statusMap[spj.status]?.class || 'bg-gray-200 text-black'"
                        >
                          {{ statusMap[spj.status]?.label || 'Unknown' }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!orderDetail.spjList || orderDetail.spjList.length === 0">
                      <td colspan="2" class="text-center py-4 text-gray-500">Tidak ada SPJ terkait</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="detail-item alt"><span>Customer ID</span><strong>{{ orderDetail.customerId || '-' }}</strong></div>
                  <div class="detail-item">
                    <span>Customer Name</span>
                    <strong>{{ getCustomerNameById(orderDetail.customerId) }}</strong>
                  </div>
                  <div class="detail-item alt"><span>Order Date</span><strong>{{ formatDate(orderDetail.orderDate) || '-' }}</strong></div>                    
                  <div class="detail-item"><span>Move Type</span><strong>{{ orderDetail.moveType || '-' }}</strong></div>
                  <div class="detail-item alt"><span>Down Payment</span><strong>{{ formatRupiah(orderDetail.downPayment) ?? '-' }}</strong></div>
                  <div class="detail-item"><span>Site ID</span><strong>{{ orderDetail.siteId || '-' }}</strong></div>
                  <div class="detail-item chassis"><span>20' Chassis Quantity</span><strong>{{ orderDetail.qtyChassis20 ?? '-' }}</strong></div>
                </div>

                <div class="space-y-3">
                    <!-- <div class="detail-item"><span>Status</span><strong>{{ statusLabel.label }}</strong></div> -->


                    <div class="detail-item alt"><span>Created By</span><strong>{{ orderDetail.createdBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Created Date</span><strong>{{ formatDate(orderDetail.createdDate) || '-' }}</strong></div>
                    <div class="detail-item alt"><span>Updated By</span><strong>{{ orderDetail.updatedBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Updated Date</span><strong>{{ formatDate(orderDetail.updatedDate) || '-' }}</strong></div>
                    <div class="detail-item alt"><span>Approved By</span><strong>{{ orderDetail.approvedBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Approved Date</span><strong>{{ formatDate(orderDetail.approvedDate) || '-' }}</strong></div>
                    <div class="detail-item chassis"><span>40' Chassis Quantity</span><strong>{{ orderDetail.qtyChassis40 ?? '-' }}</strong></div>
                </div>
            </div>

            <div class="mt-4">
              <h2 class="text-base font-semibold mb-2">Container & Tariff Details</h2>
              <div class="table-wrapper">
                <table class="load-table">
                  <thead>
                    <tr>
                      <th>Container Type</th>
                      <th>Chassis</th>
                      <th>Quantity</th>
                      <th>Tariff</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in containerTariffs" :key="row.containerType">
                      <td class="text-left">{{ row.containerType }}</td>
                      <td class="text-center">{{ row.chassisSize }}</td>
                      <td class="text-center">{{ row.quantity }}</td>
                      <td class="text-center">{{ formatRupiah(row.tariff) }}</td>
                      <td class="text-center font-bold">{{ formatRupiah(row.total) }}</td>
                    </tr>

                    <tr v-if="containerTariffs.length">
                      <td colspan="4" class="text-right font-bold">Grand Total</td>
                      <td class="text-center font-bold text-[#1C5D99]">
                        {{ formatRupiah(grandTotalTariff) }}
                      </td>
                    </tr>

                    <tr v-if="!containerTariffs.length">
                      <td colspan="5" class="text-center py-4 text-gray-500">
                        Tidak ada data container / tariff.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>


            <div class="mt-4"></div>

            <div class="detail-remarks alt">
            <span class="label">Remarks (Operasional)</span>
            <p class="text">{{ orderDetail.remarksOperasional || '-' }}</p>
            </div>

            <div class="detail-remarks">
            <span class="label">Remarks (Supervisor)</span>
            <p class="text">{{ orderDetail.remarksSupervisor || '-' }}</p>
            </div>


          </div>
  
          <div v-else class="text-center text-red-500 font-semibold">
            Order tidak ditemukan.
          </div>
        </div>
  
        <FooterComponent class="mt-auto bg-white shadow-md" />
      </div>
    </div>

    <ApprovalDialog
      :visible="showApprovalDialog"
      title="Approval Order"
      label="Remarks Supervisor:"
      @close="showApprovalDialog = false"
      @approve="(remarks) => handleApprovalAction('approve', remarks)"
      @revision="(remarks) => handleApprovalAction('revision', remarks)"
      @reject="(remarks) => handleApprovalAction('reject', remarks)" 
    />

    <ConfirmationDialog
      :visible="showConfirmation"
      @close="showConfirmation = false"
      @confirm="confirmApproval"
      :message="'Apakah Anda yakin dengan keputusan ini?'"
    />

    <SuccessDialog
      :visible="showSuccess"
      @close="goToDetail"
      :message="'Approval berhasil!'"
      buttonText="Kembali ke Detail Order"
    />

    <ConfirmationDialog
      :visible="showDoneConfirmation"
      @close="showDoneConfirmation = false"
      @confirm="() => { showDoneConfirmation = false; markOrderAsDone(); }"
      :message="'Apakah Anda yakin ingin menandai order ini sebagai selesai?'"
    />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"
    />

  </template>
  
<style scoped>

    .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #FAFAFF;
    font-weight: 500;
    min-height: 48px;
    word-wrap: break-word;
    }

    .detail-item.alt {
    background-color: #BBCDE5;
    }

    .detail-remarks {
    background-color: #FAFAFF;
    font-weight: 500;
    padding: 12px;
    margin-top: 12px;
    border-radius: 8px;
    text-align: left;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    }

    .detail-remarks.alt{
    background-color: #BBCDE5;
    }

    .detail-item.chassis{
    background-color: #1C5D99;
    color: #FAFAFF;
    }

    .detail-remarks .label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
    }

    .detail-remarks .text {
    display: block;
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-wrap; 
    }

    .bg-primary {
    background-color: #1C5D99;
    }

    .grid {
    width: 100%;
    }

    .detail-item span {
    flex: 1;
    white-space: nowrap;
    }

    .detail-item strong {
    flex: 2;
    text-align: right;
    overflow-wrap: break-word;
    word-break: break-word;
    }

    .w-full.max-w-5xl {
    flex-grow: 1; 
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    }

    .bg-red-100 {
      background-color: #EB5757;
      color: #222222;
    }

    .bg-yellow-100 {
      background-color: #F7B500;
      color: #222222;
    }

    .status-pill {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        white-space: nowrap;
    }

    .table-wrapper {
      overflow-x: auto;
      background: #F5F7FA;
      padding: 1rem;
      border-radius: 12px;
    }

    .load-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      font-size: 0.95rem;
    }

    .load-table thead {
      background: #1C5D99;
      color: white;
    }

    .load-table thead th {
      position: sticky;
      top: 0;
      padding: 0.75rem 1rem;
      text-align: center;
      font-weight: 600;
    }

    .load-table thead th:first-child {
      border-top-left-radius: 8px;
    }

    .load-table thead th:last-child {
      border-top-right-radius: 8px;
    }

    .load-table tbody tr:nth-child(odd) {
      background: #FAFAFF;
    }

    .load-table tbody tr:nth-child(even) {
      background: #FFFFFF;
    }

    .load-table tbody td {
      padding: 0.75rem 1rem;
      text-align: center;
    }

    .load-table tbody td:first-child {
      text-align: left;
    }

    .load-table tbody tr:last-child td:first-child {
      border-bottom-left-radius: 8px;
    }

    .load-table tbody tr:last-child td:last-child {
      border-bottom-right-radius: 8px;
    }


  </style>
  