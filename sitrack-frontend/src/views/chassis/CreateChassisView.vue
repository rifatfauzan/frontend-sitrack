<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useChassisStore } from '@/stores/chassis';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import router from '@/router';

const chassisStore = useChassisStore();
const toast = useToast();
const loading = ref(false);

// State Form
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
  siteId: 'JKT',
});

// Navigasi kembali ke daftar chassis
const goBack = () => {
  router.push('/chassis');
};

// Fungsi submit form
const submitForm = async () => {
  loading.value = true;
  try {
    const response = await chassisStore.addChassis({
      ...form,
      chassisKIRDate: new Date(form.chassisKIRDate),
    });

    if (response.success) {
      toast.success(response.message);
      resetForm();
      router.push('/chassis'); // Redirect ke daftar chassis
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error('Terjadi kesalahan!');
  } finally {
    loading.value = false;
  }
};


// Fungsi reset form
const resetForm = () => {
  Object.assign(form, {
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
    siteId: 'JKT',
  });
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
        
      <HeaderComponent title="Buat Chassis" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            <!-- Header yang lebih rapi -->
            <div class="header-container">
                <div class="header-content">
                    <VButton title="Kembali" class="back-button" @click="goBack">
                        <i class="pi pi-arrow-left"></i>
                    </VButton>
                    <h1 class="header-title">Buat Chassis</h1>
                </div>
            </div>


          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <!-- Chassis ID -->
              <div class="form-group">
                <label for="chassisId">Chassis ID</label>
                <input v-model="form.chassisId" type="text" id="chassisId" maxlength="8" required />
              </div>

              <!-- Size -->
              <div class="form-group">
                <label for="chassisSize">Size</label>
                <select v-model="form.chassisSize" id="chassisSize" required>
                  <option value="20">20</option>
                  <option value="40">40</option>
                </select>
              </div>

              <!-- Tahun -->
              <div class="form-group">
                <label for="chassisYear">Year</label>
                <input v-model="form.chassisYear" type="text" id="chassisYear" maxlength="4" pattern="\d{4}" required />
              </div>

              <!-- Nomor Chassis -->
              <div class="form-group">
                <label for="chassisNumber">Chassis Number</label>
                <input v-model="form.chassisNumber" type="text" id="chassisNumber" maxlength="6" />
              </div>

              <!-- Axle -->
              <div class="form-group">
                <label for="chassisAxle">Axle</label>
                <input v-model="form.chassisAxle" type="text" id="chassisAxle" />
              </div>

              <!-- Nomor KIR -->
              <div class="form-group">
                <label for="chassisKIRNo">KIR No.</label>
                <input v-model="form.chassisKIRNo" type="text" id="chassisKIRNo" maxlength="20" required />
              </div>

              <!-- Tanggal KIR -->
              <div class="form-group">
                <label for="chassisKIRDate">KIR Expiration Date</label>
                <input v-model="form.chassisKIRDate" type="date" id="chassisKIRDate" required />
              </div>

              <!-- Tipe Chassis -->
              <div class="form-group">
                <label for="chassisType">Chassis Type</label>
                <select v-model="form.chassisType" id="chassisType" required>
                  <option value="F">Flatbed</option>
                  <option value="T">Trailer</option>
                </select>
              </div>

              <!-- Keterangan -->
              <div class="form-group full-width">
                <label for="chassisRemarks">Remarks</label>
                <textarea v-model="form.chassisRemarks" id="chassisRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Buat Chassis" }}
            </VButton>
          </form>
        </div>
      </div>
      <FooterComponent />
    </div>
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

</style>
