<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useAssetStore } from '@/stores/asset';
import { useRequestAssetStore } from '@/stores/requestAsset';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import Dropdown from 'primevue/dropdown';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

const router = useRouter();
const assetStore = useAssetStore();
const requestAssetStore = useRequestAssetStore();
const { assetList } = storeToRefs(assetStore);

const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const loading = ref(false);

const form = reactive({
  remark: '',
  selectedAssetId: '',
  requestedQty: 1,
  assets: [] as { assetId: string; requestedQuantity: number; assetPrice: number }[],
});

onMounted(async () => {
  await assetStore.fetchAssets();
});

const assetOptions = computed(() => {
  return assetList.value.map((a) => ({
    label: `${a.assetId} - ${a.jenisAsset} (${a.brand})`,
    value: a.assetId,
  }));
});

const addAsset = () => {
  if (!form.selectedAssetId) {
    errorMessage.value = 'Pilih asset terlebih dahulu';
    showError.value = true;
    return;
  }

  if (form.assets.some(a => a.assetId === form.selectedAssetId)) {
    errorMessage.value = 'Asset sudah ada di daftar';
    showError.value = true;
    return;
  }

  if (form.requestedQty < 1 || form.requestedQty > 1000) {
    errorMessage.value = 'Jumlah minimal 1 dan maksimal 1000';
    showError.value = true;
    return;
  }

  const selectedAsset = assetList.value.find(a => a.assetId === form.selectedAssetId);
  if (!selectedAsset) {
    errorMessage.value = 'Asset tidak ditemukan';
    showError.value = true;
    return;
  }

  form.assets.push({
    assetId: form.selectedAssetId,
    requestedQuantity: form.requestedQty,
    assetPrice: selectedAsset.assetPrice || 0,
  });

  form.selectedAssetId = '';
  form.requestedQty = 1;
};

const removeAsset = (index: number) => {
  form.assets.splice(index, 1);
};

const confirmSubmit = () => {
  if (form.assets.length === 0) {
    errorMessage.value = 'Minimal 1 asset harus dimasukkan';
    showError.value = true;
    return;
  }
  showConfirm.value = true;
};

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;

  const payload = {
    requestRemark: form.remark,
    assets: form.assets,
  };

  try {
    const result = await requestAssetStore.createRequestAsset(payload);
    if (result.success) {
      showSuccess.value = true;
      resetForm();
    } else {
      errorMessage.value = result.message;
      showError.value = true;
    }
  } catch {
    errorMessage.value = "Terjadi kesalahan saat membuat Request Asset!";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    remark: '',
    selectedAssetId: '',
    requestedQty: 1,
    assets: [],
  });
};

const goBack = () => {
  router.push('/request-assets');
};

const goToList = () => {
  showSuccess.value = false;
  router.push('/request-assets');
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen bg-[#C8D9ED]">
      <HeaderComponent title="Buat Request Asset" />
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Request Asset</h1>
            </div>
          </div>

          <div>
            <label class="font-bold block mb-1">Pilih Asset</label>
            <Dropdown
              v-model="form.selectedAssetId"
              :options="assetOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="-- Pilih Asset --"
              filter
              class="w-full"
              :virtualScrollerOptions="{ itemSize: 38 }"
            />
          </div>

          <div>
            <label class="font-bold block mb-1">Tambah Stok</label>
            <input type="number" v-model="form.requestedQty" min="1" class="w-full border rounded px-3 py-2" />
          </div>

          <VButton class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="addAsset">
            Tambah Asset
          </VButton>

          <div v-if="form.assets.length > 0">
            <table class="w-full mt-6 border-collapse">
              <thead class="bg-[#1C5D99] text-white">
                <tr>
                  <th class="p-2">No.</th>
                  <th class="p-2">ID</th>
                  <th class="p-2">Type</th>
                  <th class="p-2">Brand</th>
                  <th class="p-2">Asset Price (Satuan)</th>
                  <th class="p-2">Tambah Stok</th>
                  <th class="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.assets" :key="item.assetId" class="odd:bg-gray-100 even:bg-white text-center">
                  <td class="p-2">{{ index + 1 }}</td>
                  <td class="p-2">{{ item.assetId }}</td>
                  <td class="p-2">{{ assetList.find(a => a.assetId === item.assetId)?.jenisAsset || '-' }}</td>
                  <td class="p-2">{{ assetList.find(a => a.assetId === item.assetId)?.brand || '-' }}</td>
                  <td class="p-2">Rp. {{ item.assetPrice.toLocaleString('id-ID') }}</td>
                  <td class="p-2">{{ item.requestedQuantity }}</td>
                  <td class="p-2">
                    <button @click="removeAsset(index)" class="text-red-500 hover:underline">Hapus</button>
                  </td>
                </tr>
                <tr class="font-bold bg-gray-200">
                  <td class="p-2 text-left" colspan="4">Total</td>
                  <td class="p-2 text-center" colspan="3">
                    Rp. {{
                      form.assets.reduce((total, item) => total + (item.assetPrice * item.requestedQuantity), 0).toLocaleString('id-ID')
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <label class="font-bold block mb-1">Remarks</label>
            <textarea v-model="form.remark" class="w-full border rounded px-3 py-2" rows="3" placeholder="Keterangan (opsional)....." maxlength="300"></textarea>
          </div>

          <VButton class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" @click="confirmSubmit" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Simpan' }}
          </VButton>
        </div>
      </div>
      <FooterComponent />
    </div>

    <ConfirmationDialog
      :visible="showConfirm"
      @close="showConfirm = false"
      @confirm="submitForm"
      :message="'Apakah data Request Asset sudah sesuai?'"
    />
    <SuccessDialog
      :visible="showSuccess"
      @close="goToList"
      :message="'Request Asset berhasil dibuat!'"
      redirectTo="/request-assets"
      buttonText="Kembali ke List Request Asset"
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

.bg-c8d9ed {
  background-color: #C8D9ED;
}

:deep(.p-dropdown) {
  min-height: 42px;
}

.header-container {
  background-color: #1C5D99;
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
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
</style>
