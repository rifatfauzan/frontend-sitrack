<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAssetStore } from '@/stores/asset';
import VButton from '@/components/VButton.vue';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

const router = useRouter();
const assetStore = useAssetStore();

const form = reactive({
  assetId: '',
  jenisAsset: '',
  jumlahStok: '',
  brand: '',
  assetRemark: '',
});

const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const confirmSubmit = () => {
  showConfirm.value = true;
};

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;

  try {
    const response = await assetStore.addAsset({
      ...form,
      requestedStok: 0,
    });

    if (response.success) {
      showSuccess.value = true;
      resetForm();
    } else {
      errorMessage.value = response.message || "Gagal menyimpan Asset!";
      showError.value = true;
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan saat menyimpan data!";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    assetId: '',
    jenisAsset: '',
    jumlahStok: '',
    brand: '',
    assetRemark: '',
  });
};

const goToList = () => {
  showSuccess.value = false;
  router.push('/assets');
};

const goBack = () => {
  router.push('/assets');
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Buat Inventory Asset" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-3xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Inventory Asset</h1>
            </div>
          </div>

          <form @submit.prevent="confirmSubmit">
            <div class="form-grid">

                <!-- asset ID (Hidden) -->
              <input v-model="form.assetId" type="hidden" id="assetId"/>

              <div class="form-group">
                <label for="jenisAsset">Asset Type <span class="required">*</span></label>
                <input v-model="form.jenisAsset" type="text" id="jenisAsset" maxlength="30" required />
              </div>

              <div class="form-group">
                <label for="jumlahStok">Stock <span class="required">*</span></label>
                <input v-model.number="form.jumlahStok" type="number" id="jumlahStok" min="0" required />
              </div>

              <div class="form-group">
                <label for="brand">Brand <span class="required">*</span></label>
                <input v-model="form.brand" type="text" id="brand" maxlength="30" required />
              </div>

              <div class="form-group full-width">
                <label for="assetRemark">Remarks</label>
                <textarea v-model="form.assetRemark" id="assetRemark" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-6" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Asset" }}
            </VButton>
          </form>
        </div>
      </div>
      <FooterComponent />
    </div>

    <ConfirmationDialog
      :visible="showConfirm"
      @close="showConfirm = false"
      @confirm="submitForm"
      :message="'Apakah data Asset sudah sesuai?'"
    />

    <SuccessDialog 
      :visible="showSuccess" 
      @close="goToList" 
      :message="'Asset baru berhasil terdaftar!'" 
      redirectTo="/assets"
      buttonText="Kembali ke List Asset"
    />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"
    />
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 80px;
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

.required {
  color: red;
  margin-left: 4px;
}
</style>
