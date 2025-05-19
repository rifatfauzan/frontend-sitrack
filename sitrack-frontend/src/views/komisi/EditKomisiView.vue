<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useKomisiStore } from '@/stores/komisi';
import { useTruckStore } from '@/stores/truck';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const komisiStore = useKomisiStore();
const truckStore = useTruckStore();
const toast = useToast();

const route = useRoute();
const komisiId = route.params.komisiId as string;

const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const form = reactive({
  truckId: '',
  location: '',
  commissionFee: 0 as number | string,
  truckCommission: 0 as number | string,
});

onMounted(async () => {
  if (!komisiId) {
    toast.error('Komisi ID tidak ditemukan');
    router.push('/komisi');
    return;
  }
  loading.value = true;
  try {
    await truckStore.fetchTrucks();
    const data = await komisiStore.fetchKomisiById(komisiId);
    if (!data) {
      toast.error('Data komisi tidak ditemukan');
      router.push('/komisi');
      return;
    }
    form.truckId = data.truckId;
    form.location = data.location;
    form.commissionFee = data.commissionFee;
    form.truckCommission = data.truckCommission;
  } catch (err) {
    toast.error('Gagal memuat data komisi');
    router.push('/komisi');
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  showSuccess.value = false;
  router.push({ name: 'detail komisi', params: { komisiId } });
};

const submitForm = () => {
  showConfirm.value = true;
};

const onSubmitForm = async () => {
  loading.value = true;
  showConfirm.value = false;
  try {
    const response = await komisiStore.updateKomisi(komisiId, {
      truckId: form.truckId,
      location: form.location,
      commissionFee: Number(form.commissionFee),
      truckCommission: Number(form.truckCommission),
    });
    if (response.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan saat memperbarui komisi.';
      showError.value = true;
    }
  } catch {
    errorMessage.value = 'Terjadi kesalahan saat memperbarui komisi.';
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
      <HeaderComponent title="Edit Komisi" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Edit Komisi</h1>
            </div>
          </div>

          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="truckId">Truck<span class="text-red-500">*</span></label>
                <select v-model="form.truckId" id="truckId" required>
                  <option value="" disabled>Pilih Truck</option>
                  <option v-for="truck in truckStore.truckList" :key="truck.vehicleId" :value="truck.vehicleId">
                    {{ truck.vehicleId }} - {{ truck.vehicleBrand }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="location">Location <span class="text-red-500">*</span></label>
                <input v-model="form.location" type="text" id="location" required />
              </div>

              <div class="form-group">
                <label for="commissionFee">Commission Fee<span class="text-red-500">*</span></label>
                <input v-model.number="form.commissionFee" type="number" id="commissionFee"required />
              </div>

              <div class="form-group">
                <label for="truckCommission">Truck Commission<span class="text-red-500">*</span></label>
                <input v-model.number="form.truckCommission" type="number" id="truckCommission" required />
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? 'Menyimpan...' : 'Perbarui Komisi' }}
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
      :message="'Apakah perubahan data Komisi sudah sesuai?'"
    />

    <SuccessDialog
      :visible="showSuccess"
      @close="goBack"
      :message="'Komisi berhasil diperbarui!'"
      redirectTo="/komisi"
      buttonText="Kembali ke Detail Komisi"
    />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"
    />
  </div>
</template>

<style scoped>
/* Grid Layout */
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
/* Form Group */
.form-group { display: flex; flex-direction: column; }
.form-group.full-width { grid-column: span 2; }
/* Label */
label { font-weight: bold; margin-bottom: 5px; }
/* Input, Select, Textarea */
input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
textarea { min-height: 80px; }
.header-container { background-color: #1C5D99; color: white; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
.header-content { display: flex; align-items: center; gap: 12px; }
.back-button { border-radius: 6px; padding: 8px 12px; display: flex; align-items: center; justify-content: center; }
.back-button i { font-size: 1.2rem; }
.header-title { font-size: 1.5rem; font-weight: bold; }
</style>