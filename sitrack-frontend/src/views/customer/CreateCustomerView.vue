<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Buat Customer" />
        <div class="flex-1 p-4 main-content overflow-auto">
          <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            
            <div class="header-container">
              <div class="header-content">
                <VButton title="Kembali" class="back-button" @click="goBack">
                  <i class="pi pi-arrow-left"></i>
                </VButton>
                <h1 class="header-title">Buat Customer</h1>
              </div>
            </div>
  
            <form @submit.prevent="confirmSubmit">
              <div class="form-grid">
                <div class="form-group">
                  <label for="name">Nama Customer<span class="required">*</span></label>
                  <input class="placeholder-gray-400" v-model="form.name" type="text" id="name" maxlength="100" placeholder="Nama Customer" required />
                </div>
                <div class="form-group">
                  <label for="siteId">Site ID<span class="required">*</span></label>
                  <input class="placeholder-gray-400" v-model="form.siteId" type="text" id="siteId" minlength="3" maxlength="3" placeholder="Site ID" required />
                </div>
                <div class="form-group">
                  <label for="address">Alamat</label>
                  <input class="placeholder-gray-400" v-model="form.address" id="address" maxlength="100" placeholder="Alamat">
                </div>
                <div class="form-group">
                  <label for="cityDestination">Kota Tujuan<span class="required">*</span></label>
                  <input class="placeholder-gray-400" v-model="form.cityDestination" type="text" id="cityDestination" maxlength="100" placeholder="Kota Tujuan" required />
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
                  <input class="placeholder-gray-400" v-model="form.commission" type="number" id="commission" min="0" step="0.01" placeholder="Rp0,00" required/>
                </div>
              </div>
              <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Data Customer" }}
              </VButton>
            </form>
          </div>
        </div>
  
        <FooterComponent />
      </div>
  
      <ConfirmationDialog
        :visible="showConfirm"
        @close="showConfirm = false"
        @confirm="submitCustomer"
        :message="'Apakah data customer sudah sesuai?'"/>

      <SuccessDialog 
        :visible="showSuccess" 
        @close="goToList" 
        :message="'Customer baru berhasil terdaftar!'" 
        redirectTo="/customers"
        buttonText="Kembali ke List Customer" />

      <ErrorDialog
        :visible="showError"
        @close="showError = false"
        :message="errorMessage"/>
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useCustomerStore } from '@/stores/customer';
  import Sidebar from '@/components/vSidebar.vue';
  import HeaderComponent from '@/components/vHeader.vue';
  import FooterComponent from '@/components/vFooter.vue';
  import VButton from '@/components/VButton.vue';
  import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
  import SuccessDialog from '@/components/SuccessDialog.vue';
  import ErrorDialog from '@/components/ErrorDialog.vue';
  import router from '@/router';
  
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
    // moveType: ''
    commission: 0,
  });
  
  const goToList = () => {
    showSuccess.value = false;
    router.push('/customers');
  };
  
  const goBack = () => {
    router.push('/customers');
  };

  const confirmSubmit = () => {
    showConfirm.value = true;
  };
  
  const submitCustomer = async () => {
    showConfirm.value = false;
    try {
      const response = await customerStore.addCustomer(form);
      if (response.success) {
        showSuccess.value = true;
      } else {
        errorMessage.value = response.message || "Terjadi kesalahan!";
        showError.value = true;
      }
    } catch (error) {
      errorMessage.value = "Terjadi kesalahan saat menyimpan data.";
      showError.value = true;
    }
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
  </style>
  