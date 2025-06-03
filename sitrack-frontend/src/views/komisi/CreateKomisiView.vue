<script setup lang="ts">
import { ref, reactive } from 'vue';

import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { useKomisiStore } from '@/stores/komisi';
import { useTruckStore } from '@/stores/truck';



const komisiStore = useKomisiStore();
const truckStore = useTruckStore();

const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

onMounted(() => {
  truckStore.fetchTrucks();
});

const form = reactive({
    truckId: '',
    location: '',
    commissionFee : 0,
    truckCommission: 0,
 
});

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

const goToList = () => router.push('/komisi');
const goBack = () => router.push('/komisi');
const confirmSubmit = () => (showConfirm.value = true);

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  if(
    form.commissionFee > 2147483647 ||
    form.truckCommission > 2147483647 
  ){
    errorMessage.value = 'Nilai komisi out of range!';
    showError.value = true;
    loading.value = false;
    return;
  }
  try {
    const response = await komisiStore.addKomisi({
      ...form,
    });

    if (response.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan!';
      showError.value = true;
    }
  } catch {
    errorMessage.value = 'Terjadi kesalahan saat menyimpan data.';
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
      <HeaderComponent title="Buat Komisi" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Komisi</h1>
            </div>
          </div>

          <form @submit.prevent="confirmSubmit">
            <div class="form-grid">
                <div class="form-group">
                <label for="truckId">Truck<span class="required">*</span></label>
                <select v-model="form.truckId" id="truckId" required>
                    <option value="" disabled>Pilih Truck</option>
                    <option
                    v-for="truck in truckStore.truckList"
                    :key="truck.vehicleId"
                    :value="truck.vehicleId"
                    >
                    {{ truck.vehicleId }} - {{ truck.vehicleBrand }}
                    </option>

                </select>
                </div>

              <div class="form-group">
                <label for="location">Location <span class="text-red-500">*</span></label>
                <input v-model="form.location" type="text" id="location" required />
              </div>

              <div class="form-group">
                <label for="commissionFee">Commission Fee <span class="required">*</span> </label>
                <input v-model="form.commissionFee" type="number" id="commissionFee" maxlength="20" />
              </div>

              <div class="form-group">
                <label for="truckCommission"> Truck Commission<span class="required">*</span> </label>
                <input v-model="form.truckCommission" type="number" id="truckCommission" maxlength="20" />
              </div>

            </div>
            <div class="mt-10"></div>
            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Komisi" }}
            </VButton>
          </form>
        </div>
      </div>

      <ConfirmationDialog
        :visible="showConfirm"
        @close="showConfirm = false"
        @confirm="submitForm"
        :message="'Apakah data Komisi sudah sesuai?'"
      />

      <SuccessDialog
        :visible="showSuccess"
        @close="goToList"
        :message="'Komisi baru berhasil terdaftar!'"
        redirectTo="/orders"
        buttonText="Kembali ke List Komisi"
      />

      <ErrorDialog
        :visible="showError"
        @close="showError = false"
        :message="errorMessage"
      />

      <FooterComponent />
    </div>
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

label {
  font-weight: bold;
  margin-bottom: 5px;
}

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

.error-text {
  color: #EB5757;
  font-size: 0.8rem;
  margin-top: 5px;
}
.required {
  color: red;
  font-weight: bold;
}
</style>
