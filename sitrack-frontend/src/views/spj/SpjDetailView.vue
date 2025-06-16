<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSpjStore } from '@/stores/spj';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';
import ApprovalDialog from '@/components/ApprovalDialog.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import type { Spj } from '@/interfaces/spj.interfaces';
import { useSopirStore } from '@/stores/sopir';
import { useOrderStore } from '@/stores/order';

const router = useRouter();
const route = useRoute();
const spjStore = useSpjStore();
const loading = ref(false);
const spjDetail = ref<Spj | null>(null);
const spjId = route.query.id as string;

const getCurrentUserRole = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch{
    return null;
  }
};

const userRole = ref(getCurrentUserRole());

onMounted(async () => {
  if (spjId) {
    loading.value = true;
    spjDetail.value = await spjStore.fetchSpjById(spjId);
    loading.value = false;
  }
});

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return '-';
  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const formatRupiah = (angka: number | string | null | undefined) => {
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

const driverName = ref<string | null>(null);
const moveType = ref<string | null>(null);
const sopirStore = useSopirStore();
const orderStore = useOrderStore();

onMounted(async () => {
  if (spjId) {
    loading.value = true;
    spjDetail.value = await spjStore.fetchSpjById(spjId);

    if (spjDetail.value?.orderId) {
      const order = await orderStore.getOrderById(spjDetail.value.orderId);
      moveType.value = order?.moveType || null;
    }

    if (spjDetail.value?.driverId) {
      const driver = await sopirStore.getSopirById(spjDetail.value.driverId);
      driverName.value = driver?.driverName || null;
    }

    loading.value = false;
  }
});

const statusMap = {
  0: { label: 'Rejected', class: 'bg-[#EB5757] text-white' },
  1: { label: 'Pending Approval', class: 'bg-[#639FAB] text-white' },
  2: { label: 'Needs Revision', class: 'bg-[#F7B500] text-black' },
  3: { label: 'Ongoing', class: 'bg-[#27AE60] text-white' },
  4: { label: 'Done', class: 'bg-white text-[#1C5D99]' },
};

const statusLabel = computed(() => {
  const status = spjDetail.value?.status as keyof typeof statusMap;
  return statusMap[status] || { label: 'Unknown', class: 'bg-gray-300 text-black' };
});

const showApprovalDialog = ref(false);
const selectedApprovalAction = ref('');
const approvalRemarks = ref('');
const showConfirmation = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');

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
  showConfirmation.value = true;
  try {
    let status = 1;
    if (selectedApprovalAction.value === 'approve') status = 3;
    else if (selectedApprovalAction.value === 'revision') status = 2;
    else if (selectedApprovalAction.value === 'reject') status = 0;

    await spjStore.approveSpj({
      spjId: spjDetail.value?.id || '',
      status,
      remarksSupervisor: approvalRemarks.value,
    });

    showSuccess.value = true;
  } catch (error) {
    errorMessage.value = (error as Error).message || 'Gagal melakukan approval SPJ.';
    showError.value = true;
  }
};

const showConfirmDone = ref(false);
const showSuccessDone = ref(false);
const showErrorDone = ref(false);
const errorMessageDone = ref('');

const confirmMarkAsDone = () => {
  showConfirmDone.value = true;
};

const submitMarkAsDone = async () => {
  showConfirmDone.value = false;
  try {
    if (spjDetail.value) {
        await spjStore.markSpjAsDone(spjDetail.value.id);
    }
    showSuccessDone.value = true;
  } catch (error) {
    errorMessageDone.value = (error as Error).message || 'Gagal menyelesaikan SPJ.';
    showErrorDone.value = true;
  }
};

const showExportSuccess = ref(false);
const showExportError = ref(false);
const exportErrorMessage = ref('');

const handleExportSpj = async (type: 'pdf' | 'excel') => {
  if (!spjDetail.value?.id) return;
  try {
    await spjStore.exportSpj(type, spjDetail.value.id);
    showExportSuccess.value = true;
  } catch (err) {
    exportErrorMessage.value = (err as Error).message || `Gagal mengunduh SPJ dalam bentuk ${type.toUpperCase()}`;
    showExportError.value = true;
  }
};

const goBack = () => {
    if (spjDetail.value?.status === 0 || spjDetail.value?.status === 1 || spjDetail.value?.status === 2) {
        router.push('/vehicle-out');
    } else if (spjDetail.value?.status === 3 || spjDetail.value?.status === 4) {
        router.push('/vehicle-in');
    }
};

const goToDetail = () => {
    router.go(0);
}

const goToEdit = () => {
  if (spjDetail.value?.id) {
    router.push({ name: 'edit spj', params: { spjId: spjDetail.value.id } });
  }
};
</script>

<template>
  <div class="flex h-screen overflow-auto">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Detail SPJ" />

      <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
        <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <Skeleton width="100%" height="2rem" class="mb-4" />
          <Skeleton width="100%" height="2rem" class="mb-4" />
          <Skeleton width="100%" height="2rem" class="mb-4" />
          <Skeleton width="100%" height="2rem" class="mb-4" />
        </div>

        <div v-else-if="spjDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center space-x-4">
              <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack">
                <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
              </VButton>
              <div>
                <h1 class="text-2xl font-bold">{{ spjDetail.id }}</h1>
                <p class="text-sm">
                  <span class="status-pill px-3 py-1 rounded font-semibold text-sm" :class="statusLabel.class">
                    {{ statusLabel.label }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex gap-2">
                <VButton
                    v-if="userRole && ['Operasional', 'Supervisor', 'Manager', 'Admin'].includes(userRole) && [3].includes(spjDetail?.status)"
                    title=".PDF"
                    icon="fas fa-file-pdf"
                    class="bg-[#EB5757] text-white px-3 py-2 rounded shadow-md"
                    @click="() => handleExportSpj('pdf')"
                />
                <VButton
                    v-if="userRole && ['Operasional', 'Supervisor', 'Manager', 'Admin'].includes(userRole) && [3].includes(spjDetail?.status)"
                    title=".XLSX"
                    icon="fas fa-file-excel"
                    class="bg-[#27AE60] text-white px-3 py-2 rounded shadow-md"
                    @click="() => handleExportSpj('excel')"
                />
                <VButton
                    v-if="userRole && ['Operasional', 'Supervisor', 'Manager', 'Admin'].includes(userRole) && [3].includes(spjDetail?.status)"
                    title="Mark as Done"
                    class="bg-[#27AE60] text-white px-4 py-2 rounded shadow-md"
                    @click="confirmMarkAsDone"
                />
                <VButton v-if="userRole && ['Supervisor', 'Manager', 'Admin'].includes(userRole) && [1].includes(spjDetail?.status)"
                    title="Approve"
                    class="bg-[#27AE60] text-white px-4 py-2 rounded shadow-md"
                    @click="handleOpenApproval"
                />
                <VButton v-if="userRole && ['Operasional', 'Supervisor', 'Manager', 'Admin'].includes(userRole) && [1,2].includes(spjDetail?.status)" title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="detail-item"><span>Order ID</span><strong>{{ spjDetail.orderId || '-' }}</strong></div>
              <div class="detail-item alt"><span>Customer ID</span><strong>{{ spjDetail.customerId || '-' }}</strong></div>
              <div class="detail-item"><span>Driver</span><strong>{{ driverName }}</strong></div>
              <div class="detail-item alt"><span>Vehicle ID</span><strong>{{ spjDetail.vehicleId || '-' }}</strong></div>
              <div class="detail-item"><span>Chassis ID</span><strong>{{ spjDetail.chassisId || '-' }}</strong></div>
              <div class="detail-item alt"><span>Chassis Size</span><strong>{{ spjDetail.chassisSize || '-' }}</strong></div>
              <div class="detail-item"><span>Container Type</span><strong>{{ spjDetail.containerType || '-' }}</strong></div>
              <div class="detail-item alt"><span>Container Qty</span><strong>{{ spjDetail.containerQty ?? '-' }}</strong></div>
              <div class="detail-item"><span>Commission</span><strong>{{ formatRupiah(spjDetail.commission) ?? '-' }}</strong></div>
              <div class="detail-item alt"><span>Other Commission</span><strong>{{ formatRupiah(spjDetail.othersCommission) ?? '-' }}</strong></div>
            </div>
            
            <div class="space-y-3">
              <div class="detail-item"><span>Move Type</span><strong>{{ moveType }}</strong></div>
              <div class="detail-item alt"><span>Date Out</span><strong>{{ formatDate(spjDetail.dateOut) }}</strong></div>
              <div class="detail-item"><span>Date In</span><strong>{{ formatDate(spjDetail.dateIn) }}</strong></div>
              <div class="detail-item alt"><span>Actual Date In</span><strong>{{ formatDate(spjDetail.actualDateIn) }}</strong></div>
              <div class="detail-item"><span>Created By</span><strong>{{ spjDetail.insertedBy || '-' }}</strong></div>
              <div class="detail-item alt"><span>Created Date</span><strong>{{ formatDate(spjDetail.insertedDate) }}</strong></div>
              <div class="detail-item"><span>Updated By</span><strong>{{ spjDetail.updatedBy || '-' }}</strong></div>
              <div class="detail-item alt"><span>Updated Date</span><strong>{{ formatDate(spjDetail.updatedDate) }}</strong></div>
              <div class="detail-item"><span>Approved By</span><strong>{{ spjDetail.approvedBy || '-' }}</strong></div>
              <div class="detail-item alt"><span>Approved Date</span><strong>{{ formatDate(spjDetail.approvedDate) }}</strong></div>
            </div>
          </div>

          <div class="detail-remarks">
            <span class="label">Remarks (Operasional)</span>
            <p class="text">{{ spjDetail.remarksOperasional || '-' }}</p>
          </div>

          <div class="detail-remarks alt">
            <span class="label">Remarks (Supervisor)</span>
            <p class="text">{{ spjDetail.remarksSupervisor || '-' }}</p>
          </div>

        </div>

        <div v-else class="text-center text-red-500 font-semibold">
          SPJ tidak ditemukan.
        </div>
      </div>
        <ApprovalDialog
            :visible="showApprovalDialog"
            title="Approval SPJ"
            label="Remarks Supervisor:"
            @close="showApprovalDialog = false"
            @approve="(remarks) => handleApprovalAction('approve', remarks)"
            @revision="(remarks) => handleApprovalAction('revision', remarks)"
            @reject="(remarks) => handleApprovalAction('reject', remarks)" />

        <ConfirmationDialog
            :visible="showConfirmation"
            @close="showConfirmation = false"
            @confirm="confirmApproval"
            :message="'Apakah Anda yakin dengan keputusan ini?'" />

        <SuccessDialog
            :visible="showSuccess"
            @close="goToDetail"
            :message="'Approval berhasil!'"
            buttonText="Kembali ke Detail SPJ" />

        <ErrorDialog
            :visible="showError"
            @close="showError = false"
            :message="errorMessage" />

        <ConfirmationDialog
            :visible="showConfirmDone"
            @close="showConfirmDone = false"
            @confirm="submitMarkAsDone"
            :message="'Apakah Anda yakin ingin menyelesaikan SPJ ini?'" />

        <SuccessDialog
            :visible="showSuccessDone"
            @close="goToDetail"
            :message="'SPJ berhasil diselesaikan!'"
            buttonText="Kembali ke Detail SPJ" />

        <ErrorDialog
            :visible="showErrorDone"
            @close="showErrorDone = false"
            :message="errorMessageDone" />

        <SuccessDialog
            :visible="showExportSuccess"
            @close="showExportSuccess = false"
            :message="'Sukses mengunduh SPJ!'"
            buttonText="Tutup"
        />
        
        <ErrorDialog
            :visible="showExportError"
            @close="showExportError = false"
            :message="exportErrorMessage"
        />

        <FooterComponent class="mt-auto bg-white shadow-md" />
    </div>
  </div>
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

.detail-remarks.alt {
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

.w-full.max-w-5xl {
  flex-grow: 1; 
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.bg-primary {
  background-color: #1C5D99;
}

.status-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 9999px;
}
</style>
