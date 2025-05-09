<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
// import { useToast } from 'vue-toastification';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useAssetStore } from '@/stores/asset';

const assetStore = useAssetStore();
const loading = ref(false);
const route = useRoute();
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

// State Form
const form = reactive({
  assetId: '',
  jenisAsset: '',
  jumlahStok: '',
  brand: '',
  assetRemark: '',
  assetPrice: '',
});

const goToDetail = () => {
  router.push({ name: 'detail asset', params: { assetId: form.assetId } });
};

onMounted(async () => {
  const assetId = route.params.assetId as string;
  if (!assetId) {
    errorMessage.value = 'Asset ID tidak ditemukan';
    showError.value = true;
    return;
  }

  loading.value = true;
  try {
    const assetData = await assetStore.getAssetById(assetId);
    if (!assetData) {
      errorMessage.value = 'Data asset tidak ditemukan';
      showError.value = true;
      return;
    }
    Object.assign(form, {
      ...assetData,
      assetId: assetData.assetId,
      jenisAsset: assetData.jenisAsset,
      brand: assetData.brand,
      jumlahStok: assetData.jumlahStok,
      assetRemark: assetData.assetRemark,
      assetPrice: assetData.assetPrice,
    });
  } catch {
    errorMessage.value = 'Terjadi kesalahan dalam mengambil data!';
    showError.value = true;
  } finally {
    loading.value = false;
  }
});

const submitForm = () => {
  showConfirm.value = true;
};
// Fungsi submit form
const onSubmitForm = async () => {
    loading.value = true;
    showConfirm.value = false;
  try {
    const response = await assetStore.editAsset(form.assetId,{
        assetId: form.assetId,
        jenisAsset: form.jenisAsset,
        jumlahStok: form.jumlahStok,
        brand: form.brand,
        assetRemark: form.assetRemark,
        assetPrice: form.assetPrice,
    });
    if (response.success) {
      showSuccess.value = true;
    } else {
        errorMessage.value = response.message || "Terjadi kesalahan!";
        showError.value = true;
    }
  } catch {
    errorMessage.value = "Terjadi kesalahan saat menyimpan data!";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
        
      <HeaderComponent title="Edit Data Asset" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            <!-- Header yang lebih rapi -->
            <div class="header-container">
                <div class="header-content">
                    <VButton title="Kembali" class="back-button" @click="goToDetail">
                        <i class="pi pi-arrow-left"></i>
                    </VButton>
                    <h1 class="header-title">Edit Data Asset</h1>
                </div>
            </div>


          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="assetId"> Asset ID</label>
                <input v-model="form.assetId" type="text" id="assetId" readonly class="readonly-input" />
              </div>

              <div class="form-group">
                <label for="jenisAsset"> Jenis Asset <span class="required">*</span></label>
                <input v-model="form.jenisAsset" type="text" id="jenisAsset" maxlength="50" required />
              </div>

              <div class="form-group">
                <label for="assetPrice">Asset Price (Satuan/Rp) <span class="required">*</span></label>
                <input v-model="form.assetPrice" type="number" id="assetPrice" maxlength="50" required />
              </div>

              <div class="form-group">
                <label for="jumlahStok"> Jumlah Stock<span class="required">*</span></label>
                <input v-model="form.jumlahStok" type="number" id="jumlahStok" maxlength="50" required />
              </div>

              <div class="form-group">
                <label for="branch"> Brand <span class="required">*</span></label>
                <input v-model="form.brand" type="text" id="brand" maxlength="50" required />
              </div>


              <div class="form-group full-width">
                <label for="assetRemark">Asset Remark</label>
                <textarea v-model="form.assetRemark" id="assetRemark" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Update Asset" }}
            </VButton>
          </form>
        </div>
      </div>
      <FooterComponent />
    </div>
    <ConfirmationDialog
        :visible="showConfirm"
        @close="showConfirm = false"
        @confirm="onSubmitForm"
        :message="'Apakah data Asset sudah sesuai?'"/>

      <SuccessDialog 
        :visible="showSuccess" 
        @close="goToDetail" 
        :message="'Berhasil Memperbarui Data Asset!'" 
        buttonText="Kembali ke Detail Asset" />

      <ErrorDialog
        :visible="showError"
        @close="showError = false"
        :message="errorMessage"/>
  </div>
</template>

<style scoped>
/* Grid Layout */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

/* Label */
label {
  font-weight: bold;
  margin-bottom: 5px;
}

/* Input, Select, Textarea */
input,
select,
textarea {
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
  /* background-color: white;
  color: #1C5D99; */
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

.readonly-input{
  background-color: #C7C7C7;
  cursor: not-allowed;
}

.required {
  color: red;
  margin-left: 4px;
}

</style>
