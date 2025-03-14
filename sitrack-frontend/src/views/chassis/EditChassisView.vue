<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChassisStore } from '@/stores/chassis';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';

// Inisialisasi
const route = useRoute();
const router = useRouter();
const chassisStore = useChassisStore();
const toast = useToast();
const loading = ref(false);

// State untuk form
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

// Ambil data chassis berdasarkan ID
onMounted(async () => {
const chassisId = route.query.id as string;
console.log("Chassis ID from route:", chassisId);
  if (!chassisId) {
    toast.error('Chassis ID tidak ditemukan');
    router.push('/chassis');
    return;
  }

  loading.value = true;
  try {
    const chassisData = await chassisStore.getChassisById(chassisId);

    if (!chassisData) {
      toast.error('Data chassis tidak ditemukan');
      router.push('/chassis');
      return;
    }

    Object.assign(form, {
      ...chassisData,
      chassisKIRDate: chassisData.chassisKIRDate 
        ? new Date(chassisData.chassisKIRDate).toISOString().split('T')[0] 
        : '',
    });
  } catch (error) {
    toast.error('Terjadi kesalahan dalam mengambil data!');
  } finally {
    loading.value = false;
  }
});

// Fungsi kembali ke halaman chassis
const goBack = () => {
  router.push('/chassis');
};

// Fungsi submit form
const submitForm = async () => {
  loading.value = true;
  try {
    const response = await chassisStore.updateChassis(form.chassisId, {
      ...form,
      chassisKIRDate: new Date(form.chassisKIRDate),
    });

    if (response.success) {
      toast.success('Chassis berhasil diperbarui!');
      router.push('/chassis');
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error('Terjadi kesalahan saat menyimpan!');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Edit Chassis" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          
          <!-- Header -->
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Edit Chassis</h1>
            </div>
          </div>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              
              <!-- Chassis ID -->
              <div class="form-group">
                <label for="chassisId">Chassis ID</label>
                <input v-model="form.chassisId" type="text" id="chassisId" readonly />
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

              <!-- Nomor KIR -->
              <div class="form-group">
                <label for="chassisKIRNo">KIR No.</label>
                <input v-model="form.chassisKIRNo" type="text" id="chassisKIRNo" maxlength="20" required/>
              </div>

              <!-- Tanggal KIR -->
              <div class="form-group">
                <label for="chassisKIRDate">KIR Expiration Date</label>
                <input v-model="form.chassisKIRDate" type="date" id="chassisKIRDate" required />
              </div>

              <!-- Division -->
              <div class="form-group">
                <label for="division">Division</label>
                <input v-model="form.division" type="text" id="division" maxlength="2" required/>
              </div>

              <!-- Dept -->
              <div class="form-group">
                <label for="dept">Dept</label>
                <input v-model="form.dept" type="text" id="dept" maxlength="2"/>
              </div>

              <!-- Tipe Chassis -->
              <div class="form-group">
                <label for="chassisType">Chassis Type</label>
                <select v-model="form.chassisType" id="chassisType" required>
                  <option value="F">Flatbed</option>
                  <option value="T">Trailer</option>
                </select>
              </div>

              <!-- Axle -->
              <div class="form-group">
                <label for="chassisAxle">Axle</label>
                <input v-model="form.chassisAxle" type="text" id="chassisAxle" maxlength="2"/>
              </div>

              <!-- Row Status -->
              <div class="form-group">
                <label for="rowStatus">Row Status</label>
                <input v-model="form.rowStatus" type="text" id="rowStatus" maxlength="1"/>
              </div>

              <!-- Site ID -->
              <div class="form-group">
                <label for="siteId">Site ID</label>
                <input v-model="form.siteId" type="text" id="siteId" maxlength="3"/>
              </div>

              <!-- Keterangan -->
              <div class="form-group full-width">
                <label for="chassisRemarks">Remarks</label>
                <textarea v-model="form.chassisRemarks" id="chassisRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <!-- Submit Button -->
            <VButton 
              type="submit" 
              class="submit-button" 
              :disabled="loading"
            >
              {{ loading ? "Menyimpan..." : "Simpan Chassis" }}
            </VButton>
          </form>
        </div>
      </div>
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

.submit-button {
  background-color: #1C5D99;
  color: white;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  margin-top: 20px;
  font-size: 1rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #174f7a;
}
</style>
