<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
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


const goToDetail = () => {
  router.go(0);
};


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
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div class="detail-item"><span>Customer ID</span><strong>{{ orderDetail.customerId || '-' }}</strong></div>

                    <div class="detail-item alt"><span>Order Date</span><strong>{{ formatDate(orderDetail.orderDate) || '-' }}</strong></div>                    
                    <div class="detail-item"><span>Move Type</span><strong>{{ orderDetail.moveType || '-' }}</strong></div>
                    <div class="detail-item alt"><span>Down Payment</span><strong>{{ orderDetail.downPayment ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Site ID</span><strong>{{ orderDetail.siteId || '-' }}</strong></div>
                    <div class="detail-item alt"><span>20' Chassis Quantity</span><strong>{{ orderDetail.qtyChassis20 ?? '-' }}</strong></div>
                    <div class="detail-item"><span>40' Chassis Quantity</span><strong>{{ orderDetail.qtyChassis40 ?? '-' }}</strong></div>
                </div>

                <div class="space-y-3">
                    <!-- <div class="detail-item"><span>Status</span><strong>{{ statusLabel.label }}</strong></div> -->
                    <div class="detail-item">
                    <span>Customer Name</span>
                    <strong>{{ getCustomerNameById(orderDetail.customerId) }}</strong>
                  </div>

                    <div class="detail-item alt"><span>Created By</span><strong>{{ orderDetail.createdBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Created Date</span><strong>{{ formatDate(orderDetail.createdDate) || '-' }}</strong></div>
                    <div class="detail-item alt"><span>Updated By</span><strong>{{ orderDetail.updatedBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Updated Date</span><strong>{{ formatDate(orderDetail.updatedDate) || '-' }}</strong></div>
                    <div class="detail-item alt"><span>Approved By</span><strong>{{ orderDetail.approvedBy || '-' }}</strong></div>
                    <div class="detail-item"><span>Approved Date</span><strong>{{ formatDate(orderDetail.approvedDate) || '-' }}</strong></div>
                </div>
            </div>

            <div class="mt-4">
            <h2 class="text-base font-semibold mb-1">Container Data</h2>
            <div class="bg-[#BBCDE5] rounded-2xl p-4 shadow-sm">
                <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="space-y-1.5">
                    <div class="detail-item"><span>Qty 120 MTFL</span><strong>{{ orderDetail.qty120mtfl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 120 MT</span><strong>{{ orderDetail.qty120mt ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 220 MTFL</span><strong>{{ orderDetail.qty220mtfl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 220 MT</span><strong>{{ orderDetail.qty220mt ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 140 MTFL</span><strong>{{ orderDetail.qty140mtfl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 140 MT</span><strong>{{ orderDetail.qty140mt ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty CH 140FL</span><strong>{{ orderDetail.qtyCh140fl ?? '-' }}</strong></div>
                </div>

                <div class="space-y-1.5">
                    <div class="detail-item"><span>Qty 120MT 120FL</span><strong>{{ orderDetail.qty120mt120fl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 120MT 220FL</span><strong>{{ orderDetail.qty120mt220fl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 220MT 120FL</span><strong>{{ orderDetail.qty220mt120fl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty 220MT 220FL</span><strong>{{ orderDetail.qty220mt220fl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty CH 120FL</span><strong>{{ orderDetail.qtyCh120fl ?? '-' }}</strong></div>
                    <div class="detail-item"><span>Qty CH 220FL</span><strong>{{ orderDetail.qtyCh220fl ?? '-' }}</strong></div>
                </div>
                </div>
            </div>
            </div>

            <div class="detail-remarks">
            <span class="label">Remarks (Operasional)</span>
            <p class="text">{{ orderDetail.remarksOperasional || '-' }}</p>
            </div>

            <div class="detail-remarks alt">
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

  </style>
  