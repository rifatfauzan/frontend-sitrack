<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Buat Customer" />
        <div class="flex-1 p-6 main-content flex justify-center">
          <div class="container mx-auto max-w-4xl bg-white p-6 rounded-lg shadow-md">
            
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
                <div class="form-group" v-for="(label, key) in fields" :key="key">
                  <label :for="key">{{ label }}</label>
                  <input
                    v-model="customerData[key]"
                    :id="key"
                    type="text"
                    class="form-input"
                    :placeholder="label"
                    :required="requiredFields.includes(key)"
                    :readonly="key === 'id'"
                    :style="{ color: customerData[key] ? '#000' : '#ccc' }"
                  />
                  <span v-if="validationErrors[key]" class="error-text">{{ validationErrors[key] }}</span>
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
  import { ref } from 'vue';
  import { useCustomerStore } from '@/stores/customer';
  import Sidebar from '@/components/Sidebar.vue';
  import HeaderComponent from '@/components/Header.vue';
  import FooterComponent from '@/components/Footer.vue';
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
  const customerData = ref({
    name: '',
    siteId: '',
    address: '',
    cityDestination: '',
    contractNo: '',
    cityOrigin: '',
    commodity: '',
    moveType: ''
  });
  
  const requiredFields = ['name', 'siteId', 'cityDestination'];
  const fields = {
    name: "Nama Customer",
    siteId: "Site ID",
    address: "Alamat",
    cityDestination: "Kota Tujuan",
    contractNo: "Nomor Kontrak",
    cityOrigin: "Kota Asal",
    commodity: "Komoditas",
    moveType: "Tipe Perpindahan"
  };
  
  const goToList = () => {
    showSuccess.value = false;
    router.push('/customers');
  };
  
  const goBack = () => {
    router.push('/customers');
  };

  const validationErrors = ref({
    name: '',
    siteId: '',
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

    if (customerData.value.siteId.length > 10) {
      validationErrors.value.siteId = "Site ID maksimal berisi 10 karakter.";
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

  const confirmSubmit = () => {
    if (validateForm()) {
      showConfirm.value = true;
    }
  };
  
  const submitCustomer = async () => {
    showConfirm.value = false;
    try {
      const result = await customerStore.addCustomer(customerData.value);
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
  </style>
  