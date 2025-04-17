<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Edit Customer" />
      
      <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md overflow-y-auto">

          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Edit Customer</h1>
            </div>
          </div>

          <form @submit.prevent="confirmUpdate">
            <div class="form-grid">
              <div class="form-group" v-for="(label, key) in fields" :key="key">
                <label :for="key">{{ label }}</label>
                <input
                  v-model="customerData[key]"
                  :id="key"
                  type="text"
                  class="form-input"
                  :placeholder="label"
                  :required="requiredFields.includes(key)"
                  :readonly="key === 'id' || key === 'siteId'"
                    :style="{ color: customerData[key] ? '#000' : '#ccc' }"
                />
                <span v-if="validationErrors[key]" class="error-text">{{ validationErrors[key] }}</span>
              </div>
            </div>

            <h2 class="text-xl font-bold text-[#1C5D99] mt-6 mb-4">Tariff</h2>
            <table class="tariff-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Std Tariff</th>
                  <th>Insurance</th>
                  <th>Tips</th>
                  <th>Police</th>
                  <th>LOLO</th>
                  <th>Others</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tariff, index) in customerData.tariffs" :key="index">
                  <td><input v-model="tariff.type" class="tariff-input" :style="{ color: tariff.type ? '#000' : '#ccc' }" placeholder="Type" required /></td>
                  <td><input v-model.number="tariff.stdTariff" type="number" class="tariff-input" :style="{ color: tariff.stdTariff ? '#000' : '#ccc' }" placeholder="Std Tariff" required /></td>
                  <td><input v-model.number="tariff.insurance" type="number" class="tariff-input" :style="{ color: tariff.insurance ? '#000' : '#ccc' }" placeholder="Insurance" /></td>
                  <td><input v-model.number="tariff.tips" type="number" class="tariff-input" :style="{ color: tariff.tips ? '#000' : '#ccc' }" placeholder="Tips" /></td>
                  <td><input v-model.number="tariff.police" type="number" class="tariff-input" :style="{ color: tariff.police ? '#000' : '#ccc' }" placeholder="Police" /></td>
                  <td><input v-model.number="tariff.lolo" type="number" class="tariff-input" :style="{ color: tariff.lolo ? '#000' : '#ccc' }" placeholder="LOLO" /></td>
                  <td><input v-model.number="tariff.others" type="number" class="tariff-input" :style="{ color: tariff.others ? '#000' : '#ccc' }" placeholder="Others" /></td>
                  <td class="tariff-total">{{ formatRupiah(calculateTotal(tariff)) }}</td>  <!-- Format Rupiah -->
                  <td><VButton @click="removeTariff(index)" class="delete-tariff">Hapus</VButton></td>
                </tr>
              </tbody>
            </table>
            <VButton @click="addTariff" class="add-tariff">+ Tambah Tarif</VButton>
            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Perubahan Customer" }}
            </VButton>
          </form>
        </div>
      </div>

      <FooterComponent />
    </div>

    <ConfirmationDialog
      :visible="showConfirm"
      @close="showConfirm = false"
      @confirm="updateCustomer"
      :message="'Apakah Anda yakin ingin memperbarui data customer?'" />

    <SuccessDialog 
      :visible="showSuccess" 
      @close="goToList" 
      :message="'Customer berhasil diperbarui!'" 
      redirectTo="/customers"
      buttonText="Kembali ke List Customer" />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"/>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

const route = useRoute();
const router = useRouter();
const customerStore = useCustomerStore();
const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const customerData = ref({
  id: '',
  siteId: '',
  name: '',
  address: '',
  cityDestination: '',
  contractNo: '',
  cityOrigin: '',
  commodity: '',
  moveType: '',
  tariffs: []
});

const requiredFields = ['name', 'cityDestination'];

const fields = {
  id: "Customer ID",
  siteId: "Site ID",
  name: "Nama Customer",
  address: "Alamat",
  cityDestination: "Kota Tujuan",
  contractNo: "Nomor Kontrak",
  cityOrigin: "Kota Asal",
  commodity: "Komoditas",
  moveType: "Tipe Perpindahan"
};

onMounted(async () => {
  const customerId = route.query.id as string;
  if (customerId) {
    const data = await customerStore.getCustomerById(customerId);
    if (data) customerData.value = data;
  }
});

const addTariff = () => {
  customerData.value.tariffs.push({
    type: '',
    stdTariff: 0,
    insurance: 0,
    tips: 0,
    police: 0,
    lolo: 0,
    others: 0,
  });
};

const removeTariff = (index) => {
  customerData.value.tariffs.splice(index, 1);
};

const calculateTotal = (tariff) => {
  return tariff.stdTariff + tariff.insurance + tariff.tips + tariff.police + tariff.lolo + tariff.others;
};

const goToList = () => {
  showSuccess.value = false;
  router.push('/customers');
};

const goBack = () => {
  router.push('/customers/detail?id=' + customerData.value.id);
};

const validationErrors = ref({
    name: '',
    address: '',
    cityDestination: '',
    contractNo: '',
    cityOrigin: '',
    commodity: '',
    moveType: ''
  });
  
const validateForm = () => {
  let isValid = true;

  Object.keys(validationErrors.value).forEach((key) => {
    validationErrors.value[key] = '';
  });

  if (customerData.value.name.length > 100) {
    validationErrors.value.name = "Nama Customer maksimal berisi 100 karakter.";
    isValid = false;
  }

  if (customerData.value.address && customerData.value.address.length > 100) {
    validationErrors.value.address = "Alamat maksimal berisi 100 karakter.";
    isValid = false;
  }

  if (customerData.value.cityDestination.length > 100) {
    validationErrors.value.cityDestination = "Kota Tujuan maksimal berisi 100 karakter.";
    isValid = false;
  }

  if (customerData.value.contractNo && customerData.value.contractNo.length > 20) {
    validationErrors.value.contractNo = "Nomor kontrak maksimal berisi 20 karakter.";
    isValid = false;
  }

  if (customerData.value.cityOrigin && customerData.value.cityOrigin.length > 100) {
    validationErrors.value.cityOrigin = "Kota Asal maksimal berisi 100 karakter.";
    isValid = false;
  }

  if (customerData.value.commodity && customerData.value.commodity.length > 50) {
    validationErrors.value.commodity = "Komoditas maksimal berisi 50 karakter.";
    isValid = false;
  }

  if (customerData.value.moveType && customerData.value.moveType.length > 10) {
    validationErrors.value.moveType = "Tipe Perpindahan maksimal berisi 10 karakter.";
    isValid = false;
  }

  return isValid;
};

const confirmUpdate = () => {
  if (validateForm()) {
    showConfirm.value = true;
  }
};

const updateCustomer = async () => {
  showConfirm.value = false;
  try {
    const result = await customerStore.updateCustomer(customerData.value);
    if (result.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = result.message || "Terjadi kesalahan!";
      showError.value = true;
    }
  } catch (error) {
    errorMessage.value = "Terjadi kesalahan saat menyimpan data.";
    showError.value = true;
  }
};

const formatRupiah = (angka) => {
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

</script>
  
<style scoped>
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
  
  .header-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
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
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  input[readonly] {
    background-color: #f3f3f3;
    cursor: not-allowed;
  }

  textarea {
    min-height: 80px;
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

  .error-text {
    color: #EB5757;
    font-size: 0.8rem;
    margin-top: 5px;
  }

  .tariff-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }

  .tariff-table th, .tariff-table td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
  }

  .tariff-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }

  .tariff-total {
    background-color: #d4edda;
    font-weight: bold;
  }

  .delete-tariff {
    background-color: #dc3545;
    color: white;
  }

  .delete-tariff:hover {
    background-color: #a71d2a;
  }
</style>
  