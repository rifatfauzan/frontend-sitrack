
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useChassisStore } from '@/stores/chassis';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';

const chassisStore = useChassisStore();
const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const form = reactive({
  chassisId: '',
  chassisSize: '20',
  chassisYear: '',
  chassisNumber: '',
  chassisAxle: '',
  chassisKIRNo: '',
  chassisKIRDate: '',
  chassisType: 'F',
  chassisRemarks: '',
  division: '01',
  dept: 'TR',
  rowStatus: 'A',
  siteId: 'JKT'
});

const goToList = () => {
  router.push('/chassis');
};

const goBack = () => {
  router.push('/chassis');
};

const confirmSubmit = () => {
  showConfirm.value = true;
};

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  try {
    const response = await chassisStore.addChassis({
      ...form,
      chassisKIRDate: new Date(form.chassisKIRDate)
    });

    if (response.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan!';
      showError.value = true;
    }
  } catch (error) {
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
      <HeaderComponent title="Buat Chassis" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">

          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Chassis</h1>
            </div>
          </div>

          <form @submit.prevent="confirmSubmit">
            <div class="form-grid">
              <!-- <div class="form-group">
                <label for="chassisId">Chassis ID</label>
                <input v-model="form.chassisId" type="text" id="chassisId" maxlength="8" required />
              </div> -->
              <div class="form-group">
                <label for="chassisSize">Size</label>
                <select v-model="form.chassisSize" id="chassisSize" required>
                  <option value="20">20</option>
                  <option value="40">40</option>
                </select>
              </div>
              <div class="form-group">
                <label for="chassisYear">Year</label>
                <input v-model="form.chassisYear" type="text" id="chassisYear" minlength="4" maxlength="4" required />
              </div>
              <div class="form-group">
                <label for="chassisNumber">Chassis Number</label>
                <input v-model="form.chassisNumber" type="text" id="chassisNumber" minlength="6" maxlength="6" />
              </div>
              <div class="form-group">
                <label for="chassisKIRNo">KIR No.</label>
                <input v-model="form.chassisKIRNo" type="text" id="chassisKIRNo" minlength="20" maxlength="20" required />
              </div>
              <div class="form-group">
                <label for="chassisKIRDate">KIR Expiration Date</label>
                <input v-model="form.chassisKIRDate" type="date" id="chassisKIRDate" required />
              </div>
              <div class="form-group">
                <label for="division">Division</label>
                <input v-model="form.division" type="text" id="division" minlength="2" maxlength="2" required />
              </div>
              <div class="form-group">
                <label for="dept">Dept</label>
                <input v-model="form.dept" type="text" id="dept" minlength="2" maxlength="2" />
              </div>
              <div class="form-group">
                <label for="chassisType">Chassis Type</label>
                <select v-model="form.chassisType" id="chassisType" required>
                  <option value="F">Flatbed</option>
                  <option value="T">Trailer</option>
                </select>
              </div>
              <div class="form-group">
                <label for="chassisAxle">Axle</label>
                <input v-model="form.chassisAxle" type="text" id="chassisAxle" minlength="2"  maxlength="2" />
              </div>
              <div class="form-group">
                <label for="rowStatus">Row Status</label>
                <input v-model="form.rowStatus" type="text" id="rowStatus" minlength="1"  maxlength="1" />
              </div>
              <div class="form-group">
                <label for="siteId">Site ID</label>
                <input v-model="form.siteId" type="text" id="siteId" minlength="3"   maxlength="3" />
              </div>
              
            </div>

            <div class="form-group full-width">
                <label for="chassisRemarks">Remarks</label>
                <textarea v-model="form.chassisRemarks" id="chassisRemarks" maxlength="300"></textarea>
              </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Chassis" }}
            </VButton>
          </form>

        </div>
      </div>

      <ConfirmationDialog
        :visible="showConfirm"
        @close="showConfirm = false"
        @confirm="submitForm"
        :message="'Apakah data chassis sudah sesuai?'"
      />

      <SuccessDialog
        :visible="showSuccess"
        @close="goToList"
        :message="'Chassis baru berhasil terdaftar!'"
        redirectTo="/chassis"
        buttonText="Kembali ke List Chassis"
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
</style>
