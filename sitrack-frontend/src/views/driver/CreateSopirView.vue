<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useSopirStore } from '@/stores/sopir';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';

const sopirStore = useSopirStore();
const toast = useToast();
const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

// State Form
const form = reactive({
  driverName: '',
  driver_KTP_No: '',
  driver_KTP_Date: '',
  driver_SIM_No: '',
  driver_SIM_Date: '',
  driverCo: '',
  driverCoContact: '',
  driverContact: '',
  driverNumber: '',
  driverType: '',
  driverRemarks: '',
  recordStatus: 'A',
  driverJoinDate: '',
  rowStatus: 'A',
  siteId: 'JKT',
});


const goBack = () => {
  showSuccess.value = false;
  router.push('/sopir/viewall');
};

const submitForm = () => {
  showConfirm.value = true;
};
// Fungsi submit form
const onSubmitForm = async () => {
  loading.value = true; 
  showConfirm.value = false;

  try {

    const response = await sopirStore.addSopir({
        driverName: form.driverName,
        driver_KTP_No: form.driver_KTP_No,
        driver_KTP_Date: new Date(form.driver_KTP_Date),
        driver_SIM_No: form.driver_SIM_No,
        driver_SIM_Date: new Date(form.driver_SIM_Date) ,
        driverCo: form.driverCo,
        driverCoContact: form.driverCoContact,
        driverContact : form.driverContact,
        driverNumber: form.driverNumber,
        driverRemarks: form.driverRemarks,
        recordStatus: form.recordStatus,
        driverJoinDate: new Date(form.driverJoinDate),
        rowStatus: form.rowStatus,
        siteId: form.siteId,
        driverType: form.driverType,

    });

    if (response.success) {
      showSuccess.value = true;
      resetForm();
    } else {
      toast.error(response.message);
      errorMessage.value = response.message;
      showError.value = true;
    }
  } catch {
    toast.error('Terjadi kesalahan!');
    errorMessage.value ="Terjadi kesalahan!";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};


// Fungsi reset form
const resetForm = () => {
  Object.assign(form, {
    driverName: '',
    driver_KTP_No: '',
    driver_KTP_Date: '',
    driver_SIM_No: '',
    driver_SIM_Date: '',
    driverCo: '',
    driverContact: '',
    driverCoContact: '',
    driverNumber: '',
    driverType: '',
    driverRemarks: '',
    recordStatus: 'A',
    driverJoinDate: '',
    rowStatus: 'A',
    siteId: 'JKT',
  });
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
        
      <HeaderComponent title="Buat Data Sopir" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            <!-- Header yang lebih rapi -->
            <div class="header-container">
                <div class="header-content">
                    <VButton title="Kembali" class="back-button" @click="goBack">
                        <i class="pi pi-arrow-left"></i>
                    </VButton>
                    <h1 class="header-title">Buat Data Sopir</h1>
                </div>
            </div>


          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="driverName"> Driver Name <span class="required">*</span>
                </label>
                <input v-model="form.driverName" type="text" id="driverName" maxlength="50" required />
              </div>

              <!-- Size -->
              <div class="form-group">
                <label for="driver_KTP_No">Driver KTP Number<span class="required">*</span>
                </label>
                <input v-model="form.driver_KTP_No" type="text" id="driver_KTP_No" maxlength="16" minlength="16" required />
              </div>

              <!-- Tahun
              <div class="form-group">
                <label for="driver_KTP_Date">Driver KTP Date</label>
                <input v-model="form.driver_KTP_Date" type="date" id="driver_KTP_Date" required />
              </div> -->

              <div class="form-group">
                <label for="driver_SIM_No">Driver SIM Number <span class="required">*</span>
                </label>
                <input v-model="form.driver_SIM_No" type="text" id="driver_SIM_No" maxlength="13" minlength="13"  required />
              </div>

              <div class="form-group">
                <label for="driver_SIM_Date">Driver SIM Date <span class="required">*</span>
                </label>
                <input v-model="form.driver_SIM_Date" type="date" id="driver_SIM_Date" required />
              </div>

              <div class="form-group">
                <label for="driverCo">Co Driver</label>
                <input v-model="form.driverCo" type="text" id="driverCo" maxlength="50" />
              </div>

              <div class="form-group">
                <label for="driverCoContact">Co Driver Contact</label>
                <input v-model="form.driverCoContact" type="text" id="driverCoContact" />
              </div>

              <!-- <div class="form-group">
                <label for="driverNumber">Driver Number</label>
                <input v-model="form.driverNumber" type="text" id="driverNumber" maxlength="6" />
              </div> -->

              <div class="form-group">
                <label for="driverContact">Driver Contact</label>
                <input v-model="form.driverContact" type="text" id="driverContact" maxlength="20" />
              </div>

              <div class="form-group">
                <label for="siteId">Site ID<span class="required">*</span>
                </label>
                <input v-model="form.siteId" type="text" id="siteId" maxlength="3" required />
              </div>

              <div class="form-group">
                <label for="driverType">Driver Type</label>
                <input v-model="form.driverType" type="text" id="driverType" maxlength="1"  />
              </div>

              <div class="form-group">
                <label for="recordStatus">Record Status</label>
                <input v-model="form.recordStatus" type="text" id="recordStatus" maxlength="1"  />
              </div>

              <!-- <div class="form-group">
                <label for="rowStatus">Row Status</label>
                <input v-model="form.rowStatus" type="text" id="rowStatus" maxlength="1" />
              </div> -->

              <div class="form-group">
                <label for="driverJoinDate">Driver Join Date <span class="required">*</span> </label>
                <input v-model="form.driverJoinDate" type="date" id="driverJoinDate" required />
              </div>


              <!-- Keterangan -->
              <div class="form-group full-width">
                <label for="driverRemarks">Remarks</label>
                <textarea v-model="form.driverRemarks" id="driverRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Buat Sopir" }}
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
        :message="'Apakah data Sopir sudah sesuai?'"/>

      <SuccessDialog 
        :visible="showSuccess" 
        @close="goBack"  
        :message="'Sopir baru berhasil terdaftar!'" 
        redirectTo="/sopir/viewall"
        buttonText="Kembali ke List Sopir" />

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

.required {
  color: red;
  font-weight: bold;
}

</style>
