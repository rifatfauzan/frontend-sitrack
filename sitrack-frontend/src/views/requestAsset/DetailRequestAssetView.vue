<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRequestAssetStore } from '@/stores/requestAsset';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ApprovalDialog from '@/components/ApprovalDialog.vue';
import type { RequestAsset } from '@/interfaces/requestAsset.interfaces';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';


const route = useRoute();
const router = useRouter();
const requestAssetStore = useRequestAssetStore();

const id = route.query.id as string;
const requestAsset = ref<RequestAsset | null>(null);
const showApprovalDialog = ref(false);
const approvalRemark = ref('');
// const loading = ref(false);

const selectedApprovalAction = ref('');
const showConfirmation = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  requestAsset.value = await requestAssetStore.fetchRequestAssetById(id);
});

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0: return 'Pending Approval';
    case 1: return 'Approved';
    case 2: return 'Needs Revision';
    case 3: return 'Rejected';
    default: return 'Unknown';
  }
};

const goToEdit = () => {
  router.push({ path: '/request-assets/edit', query: { id } });
};

const goBack = () => {
  router.push('/request-assets');
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 0: return 'bg-gray-500';
    case 1: return 'bg-green-600';
    case 2: return 'bg-yellow-500';
    case 3: return 'bg-red-600';
    default: return 'bg-blue-500';
  }
};

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

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
  return formattedDate;
};

const handleApprovalAction = (action: string, remarks: string) => {
  selectedApprovalAction.value = action;
  approvalRemark.value = remarks;
  showApprovalDialog.value = false;
  showConfirmation.value = true;
};

const confirmApproval = async () => {
  showConfirmation.value = false;
  try {
    let status: number;
    if (selectedApprovalAction.value === 'approve') status = 1;
    else if (selectedApprovalAction.value === 'revision') status = 2;
    else if (selectedApprovalAction.value === 'reject') status = 3;
    else throw new Error('Aksi tidak dikenali');

    await requestAssetStore.updateRequestAssetStatus(id, status, approvalRemark.value);
    showSuccess.value = true;
  } catch (err) {
    errorMessage.value = (err as Error).message || 'Gagal melakukan approval.';
    showError.value = true;
  }
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen bg-[#C8D9ED]">
      <HeaderComponent title="Detail Request Asset" />
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-5xl mx-auto bg-white p-6 rounded shadow space-y-6">
            <div class="header-container">
                <div class="flex items-center gap-3">
                    <VButton title="Kembali" class="back-button" @click="goBack">
                    <i class="pi pi-arrow-left"></i>
                    </VButton>
                    <h1 class="header-title">{{ requestAsset?.requestAssetId }}</h1>
                    <span class="status-pill px-3 py-1 rounded font-semibold text-sm":class="['px-2 py-1 rounded text-sm font-semibold text-white', getStatusColor(requestAsset?.status)]">
                    {{ getStatusLabel(requestAsset?.status) }}
                    </span>
                </div>
                <div class="flex items-center gap-3">
                    <VButton v-if="['Admin','Supervisor', 'Manager'].includes(userRole) && ![1, 2, 3].includes(requestAsset?.status)" class="custom-button px-4 py-2 rounded" @click="showApprovalDialog = true">Approval</VButton>
                    <VButton v-if="['Admin','Mekanik','Supervisor'].includes(userRole) && ![1, 3].includes(requestAsset?.status)" class="custom-button px-4 py-2 rounded" @click="goToEdit">Edit</VButton>
                </div>
            </div>

            <table class="w-full text-left border-collapse">
              <thead class="bg-[#1C5D99] text-white">
                <tr>
                  <th class="p-2">No.</th>
                  <th class="p-2">ID</th>
                  <th class="p-2">Type</th>
                  <th class="p-2">Brand</th>
                  <th class="p-2">Asset Price (Satuan)</th>
                  <th class="p-2">Requested Stok</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in requestAsset?.assets || []" :key="item.assetId" class="odd:bg-gray-100 even:bg-white">
                  <td class="p-2 text-center">{{ index + 1 }}</td>
                  <td class="p-2 text-center">{{ item.assetId }}</td>
                  <td class="p-2 text-center">{{ item.jenisAsset || '-' }}</td>
                  <td class="p-2 text-center">{{ item.brand || '-' }}</td>
                  <td class="p-2 text-center">Rp.{{ item.assetPrice?.toLocaleString('id-ID') || '-' }}</td>
                  <td class="p-2 text-center">{{ item.requestedQuantity }}</td>
                </tr>

                <tr class="font-bold bg-gray-200">
                  <td class="p-2 text-left" colspan="4">Total</td>
                  <td class="p-2 text-center" colspan="2">
                    Rp.{{
                      (requestAsset?.assets || [])
                        .reduce((total, item) => total + (item.assetPrice * item.requestedQuantity), 0)
                        .toLocaleString('id-ID')
                    }}
                  </td>
                </tr>
              </tbody>
            </table>

          <div class="bg-[#C8D9ED] p-4 rounded mt-4">
            <strong>Remarks:</strong>
            <p class="mt-1 text-gray-700">{{ requestAsset?.requestRemark || '-' }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="space-y-3">
                <div class="detail-item alt"><span>Created By</span><strong>{{ requestAsset?.createdBy || '-' }}</strong></div>
                <div class="detail-item"><span>Created Date</span><strong>{{ formatDate(requestAsset?.createdDate)|| '-' }}</strong></div>
                <div class="detail-item alt"><span>Updated By</span><strong>{{ requestAsset?.updatedBy || '-' }}</strong></div>
                <div class="detail-item"><span>Updated Date</span><strong>{{ formatDate(requestAsset?.updatedDate) || '-' }}</strong></div>
            </div>
            <div class="space-y-3">
                <div class="detail-item alt"><span>Approval By</span><strong>{{ requestAsset?.approvalBy || '-' }}</strong></div>
                <div class="detail-item"><span>Approval Date</span><strong>{{ formatDate(requestAsset?.approvalDate) || '-'}}</strong></div>
            </div>
           </div>
        </div>
      </div>
      <FooterComponent />
    </div>

    <ApprovalDialog
      :visible="showApprovalDialog"
      title="Approval Request Asset"
      label="Remarks:"
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
      @close="router.go(0)"
      :message="'Approval berhasil!'"
      buttonText="Kembali ke Detail Request"
    />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"
    />
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

.header-container {
  background-color: #1C5D99;
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button i {
  font-size: 1.2rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.custom-button {
  background-color: #BBCDE5;
  color: black;
}

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