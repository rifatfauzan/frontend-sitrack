<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Edit Customer" />
      <div class="flex-1 p-6 main-content overflow-y-auto">
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
              <div class="form-group">
                <label for="name">ID Customer</label>
                <input class="placeholder-gray-400" v-model="form.id" type="text" id="id" maxlength="100" placeholder="ID Customer" readonly />
              </div>
              <div class="form-group">
                <label for="siteId">Site ID<span class="required">*</span></label>
                <input class="placeholder-gray-400" v-model="form.siteId" type="text" id="siteId" minlength="3" maxlength="3" placeholder="Site ID" readonly />
              </div>
              <div class="form-group">
                <label for="name">Nama Customer<span class="required">*</span></label>
                <input class="placeholder-gray-400" v-model="form.name" type="text" id="name" maxlength="100" placeholder="Nama Customer" required />
              </div>
              <div class="form-group">
                <label for="cityDestination">Kota Tujuan<span class="required">*</span></label>
                <input class="placeholder-gray-400" v-model="form.cityDestination" type="text" id="cityDestination" maxlength="100" placeholder="Kota Tujuan" required />
              </div>
              <div class="form-group">
                <label for="address">Alamat</label>
                <input class="placeholder-gray-400" v-model="form.address" id="address" maxlength="100" placeholder="Alamat">
              </div>
              <div class="form-group">
                <label for="contractNo">Nomor Kontrak</label>
                <input class="placeholder-gray-400" v-model="form.contractNo" type="text" id="contractNo" maxlength="20" placeholder="Nomor Kontrak"/>
              </div>
              <div class="form-group">
                <label for="cityOrigin">Kota Asal</label>
                <input class="placeholder-gray-400" v-model="form.cityOrigin" type="text" id="cityOrigin" maxlength="100" placeholder="Kota Asal"/>
              </div>
              <div class="form-group">
                <label for="commodity">Komoditas</label>
                <input class="placeholder-gray-400" v-model="form.commodity" type="text" id="commodity" maxlength="50" placeholder="Komoditas"/>
              </div>
              <div class="form-group">
                <label for="commission">Komisi<span class="required">*</span></label>
                <input class="placeholder-gray-400" v-model.number="form.commission" type="number" id="commission" min="0" step="0.01" placeholder="Rp0,00" required/>
              </div>
            </div>

            <h2 class="text-xl font-bold text-[#1C5D99] mt-6 mb-4">Tariff</h2>
            <table v-if="form.tariffs.length" class="tariff-table">
              <thead>
                <tr>
                  <th>Chassis Type</th>
                  <th>Move Type</th>
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
                <tr v-for="(tariff, index) in form.tariffs" :key="index">
                  <td style="width: 7%;"><input v-model="tariff.chassisType" class="tariff-input" :style="{ color: tariff.chassisType ? '#000' : '#ccc' }" placeholder="Type" /></td>
                  <td style="width: 15%;">
                    <select v-model="tariff.moveType" class="tariff-input" :style="{ color: tariff.moveType ? '#000' : '#ccc' }">
                      <option value="NORMAL">NORMAL</option>
                      <option value="REPO">REPO</option>
                      <option value="OFFHERE">OFFHERE</option>
                      <option value="KADE">KADE</option>
                    </select>
                  </td>
                  <td><input v-model.number="tariff.stdTariff" type="number" class="tariff-input" :style="{ color: tariff.stdTariff ? '#000' : '#ccc' }" placeholder="Std Tariff" /></td>
                  <td><input v-model.number="tariff.insurance" type="number" class="tariff-input" :style="{ color: tariff.insurance ? '#000' : '#ccc' }" placeholder="Insurance" /></td>
                  <td><input v-model.number="tariff.tips" type="number" class="tariff-input" :style="{ color: tariff.tips ? '#000' : '#ccc' }" placeholder="Tips" /></td>
                  <td><input v-model.number="tariff.police" type="number" class="tariff-input" :style="{ color: tariff.police ? '#000' : '#ccc' }" placeholder="Police" /></td>
                  <td><input v-model.number="tariff.lolo" type="number" class="tariff-input" :style="{ color: tariff.lolo ? '#000' : '#ccc' }" placeholder="LOLO" /></td>
                  <td><input v-model.number="tariff.others" type="number" class="tariff-input" :style="{ color: tariff.others ? '#000' : '#ccc' }" placeholder="Others" /></td>
                  <td class="tariff-total">{{ formatRupiah(calculateTotal(tariff)) }}</td>
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
      @close="goBack" 
      :message="'Customer berhasil diperbarui!'" 
      buttonText="Kembali ke Detail Customer" />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"/>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
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
const form = reactive({
  id: '',
  name: '',
  siteId: 'JKT',
  address: '',
  cityDestination: '',
  contractNo: '',
  cityOrigin: '',
  commodity: '',
  commission: 0,
  tariffs: [
    {
      chassisType: '',
      moveType: '',
      stdTariff: 0,
      insurance: 0,
      tips: 0,
      police: 0,
      lolo: 0,
      others: 0,
    },
  ],
});

onMounted(async () => {
  const customerId = route.query.id as string;
  if (customerId) {
    const data = await customerStore.getCustomerById(customerId);
    if (data) {
      Object.assign(form, data);
    }
  }
});

const addTariff = () => {
  form.tariffs.push({
    chassisType: '',
    moveType: '',
    stdTariff: 0,
    insurance: 0,
    tips: 0,
    police: 0,
    lolo: 0,
    others: 0,
  });
};

const removeTariff = (index: number) => {
  form.tariffs.splice(index, 1);
};

const calculateTotal = (tariff: { stdTariff: number; insurance: number; tips: number; police: number; lolo: number; others: number }) => {
  return tariff.stdTariff + tariff.insurance + tariff.tips + tariff.police + tariff.lolo + tariff.others;
};

const goBack = () => {
  router.push('/customers/detail?id=' + form.id);
};

const confirmUpdate = () => {
  showConfirm.value = true;
};

const updateCustomer = async () => {
  showConfirm.value = false;
  try {
    const result = await customerStore.updateCustomer({
      ...form,
      tariffs: form.tariffs,
    });
    if (result.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = result.message || "Terjadi kesalahan!";
      showError.value = true;
    }
  } catch {
    errorMessage.value = "Terjadi kesalahan saat menyimpan data.";
    showError.value = true;
  }
};

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

  .required {
    color: #EB5757;
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
  