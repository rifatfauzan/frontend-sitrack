<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSopirStore } from '@/stores/sopir';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

const sopirStore = useSopirStore();
const toast = useToast();
const loading = ref(false);
const route = useRoute();

// State Form
const form = reactive({
  driverId: '',
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
// Get data sopir by ID

onMounted(async () => {
const driverId = route.params.driverId as string;
console.log("Driver ID from route:", driverId);
  if (!driverId) {
    toast.error('Driver ID tidak ditemukan');
    router.push('/sopir/viewall');
    return;
  }

  loading.value = true;
  try {
    const sopirData = await sopirStore.getSopirById(driverId);
    if (!sopirData) {
      toast.error('Data sopir tidak ditemukan');
      router.push('/sopir/viewall');
      return;
    }

    Object.assign(form, {
      ...sopirData,
      driver_KTP_Date: sopirData.driver_KTP_Date 
        ? new Date(sopirData.driver_KTP_Date).toISOString().split('T')[0] 
        : '',
      driver_SIM_Date: sopirData.driver_SIM_Date 
        ? new Date(sopirData.driver_SIM_Date).toISOString().split('T')[0] 
        : '',
      driverJoinDate: sopirData.driverJoinDate 
        ? new Date(sopirData.driverJoinDate).toISOString().split('T')[0] 
        : '',
    });
  } catch (error) {
    toast.error('Terjadi kesalahan dalam mengambil data!');
  } finally {
    loading.value = false;
  }
});
// Navigasi kembali ke daftar chassis
const goBack = () => {
  router.push('/sopir/viewall');
};

// Fungsi submit form
const submitForm = async () => {
  loading.value = true;
  try {
    const response = await sopirStore.updateSopir(form.driverId,{
        driverName: form.driverName,
        driver_KTP_No: form.driver_KTP_No,
        driver_KTP_Date: new Date(form.driver_KTP_Date),
        driver_SIM_No: form.driver_SIM_No,
        driver_SIM_Date: new Date(form.driver_SIM_Date),
        driverCo: form.driverCo,
        driverCoContact: form.driverCoContact,
        driverNumber: form.driverNumber,
        driverContact: form.driverContact,
        driverRemarks: form.driverRemarks,
        recordStatus: form.recordStatus,
        driverJoinDate: new Date(form.driverJoinDate),
        rowStatus: form.rowStatus,
        siteId: form.siteId,
        driverType: form.driverType,
    });

    if (response.success) {
      toast.success(response.message);
      router.push('/sopir/viewall'); 
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error('Terjadi kesalahan!');
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
        
      <HeaderComponent title="Edit Data Sopir" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            <!-- Header yang lebih rapi -->
            <div class="header-container">
                <div class="header-content">
                    <VButton title="Kembali" class="back-button" @click="goBack">
                        <i class="pi pi-arrow-left"></i>
                    </VButton>
                    <h1 class="header-title">Edit Data Sopir</h1>
                </div>
            </div>


          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <!-- Chassis ID -->
              <div class="form-group">
                <label for="driverId"> Driver ID</label>
                <input v-model="form.driverId" type="text" id="driverId" readonly />
              </div>

              <div class="form-group">
                <label for="driverName"> Driver Name</label>
                <input v-model="form.driverName" type="text" id="driverName" maxlength="50" required />
              </div>

              <!-- Size -->
              <div class="form-group">
                <label for="driver_KTP_No">Driver KTP Number</label>
                <input v-model="form.driver_KTP_No" type="text" id="driver_KTP_No" maxlength="13" minlength="13" readonly />
              </div>

              <!-- Tahun
              <div class="form-group">
                <label for="driver_KTP_Date">Driver KTP Date</label>
                <input v-model="form.driver_KTP_Date" type="date" id="driver_KTP_Date" required />
              </div> -->

              <div class="form-group">
                <label for="driver_SIM_No">Driver SIM Number</label>
                <input v-model="form.driver_SIM_No" type="text" id="driver_SIM_No" maxlength="13" minlength="13" required />
              </div>

              <div class="form-group">
                <label for="driver_SIM_Date">Driver SIM Date</label>
                <input v-model="form.driver_SIM_Date" type="date" id="driver_SIM_Date" required />
              </div>

              <div class="form-group">
                <label for="driverCo">Driver Company</label>
                <input v-model="form.driverCo" type="text" id="driverCo" maxlength="50" />
              </div>

              <div class="form-group">
                <label for="driverCoContact">Driver Company Contact</label>
                <input v-model="form.driverCoContact" type="text" id="driverCoContact" />
              </div>
              
              <div class="form-group">
                <label for="driverContact">Driver Contact</label>
                <input v-model="form.driverContact" type="text" id="driverContact" maxlength="20" required />
              </div>

              <div class="form-group">
                <label for="driverNumber">Driver Number</label>
                <input v-model="form.driverNumber" type="text" id="driverNumber" maxlength="20" required />
              </div>

              <div class="form-group">
                <label for="driverType">Driver Type</label>
                <input v-model="form.driverType" type="text" id="driverType" maxlength="1" required />
              </div>

              <div class="form-group">
                <label for="recordStatus">Record Status</label>
                <input v-model="form.recordStatus" type="text" id="recordStatus" maxlength="1" required />
              </div>

              <div class="form-group">
                <label for="driverJoinDate">Driver Join Date</label>
                <input v-model="form.driverJoinDate" type="date" id="driverJoinDate" required />
              </div>

              <div class="form-group">
                <label for="rowStatus">Row Status</label>
                <input v-model="form.rowStatus" type="text" id="rowStatus" maxlength="1" required />
              </div>

              <div class="form-group">
                <label for="siteId">Site ID</label>
                <input v-model="form.siteId" type="text" id="siteId" readonly />
              </div>

              <div class="form-group full-width">
                <label for="driverRemarks">Remarks</label>
                <textarea v-model="form.driverRemarks" id="driverRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Update Sopir" }}
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
