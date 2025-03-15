<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTruckStore } from '@/stores/truck';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';

const route = useRoute();
const router = useRouter();
const truckStore = useTruckStore();
const toast = useToast();
const loading = ref(false);
const truckId = route.query.id as string;

const form = reactive({
  vehicleId: '',
  vehicleBrand: '',
  vehicleYear: '',
  vehiclePlateNo: '',
  vehicleSTNKDate: '',
  vehicleKIRNo: '',
  vehicleKIRDate: '',
  vehicleCylinder: '',
  vehicleChassisNo: '',
  vehicleEngineNo: '',
  vehicleBizLicenseNo: '',
  vehicleBizLicenseDate: '',
  vehicleDispensationNo: '',
  vehicleDispensationDate: '',
  vehicleRemarks: '',
  siteId: '',
  vehicleType: '',
  division: '',
  dept: '',
  rowStatus: '',
  vehicleNumber: '',
  insertedBy: '',
  insertedDate: '',
  updatedBy: '',
  updatedDate: '',
});

// Ambil data truck berdasarkan ID
onMounted(async () => {
  const truckId = route.query.id as string;
  console.log("Truck ID dari route:", truckId);
  
  if (!truckId) {
    toast.error('Truck ID tidak ditemukan');
    router.push('/trucks');
    return;
  }

  loading.value = true;
  try {
    const truckData = await truckStore.getTruckById(truckId);

    if (!truckData) {
      toast.error('Data truck tidak ditemukan');
      router.push('/trucks');
      return;
    }

    // Assign data ke form dengan format yang benar
    Object.assign(form, {
      ...truckData,
      vehicleSTNKDate: truckData.vehicleSTNKDate 
        ? new Date(truckData.vehicleSTNKDate).toISOString().split('T')[0] 
        : '',
      vehicleKIRDate: truckData.vehicleKIRDate 
        ? new Date(truckData.vehicleKIRDate).toISOString().split('T')[0] 
        : '',
      vehicleBizLicenseDate: truckData.vehicleBizLicenseDate 
        ? new Date(truckData.vehicleBizLicenseDate).toISOString().split('T')[0] 
        : '',
      vehicleDispensationDate: truckData.vehicleDispensationDate 
        ? new Date(truckData.vehicleDispensationDate).toISOString().split('T')[0] 
        : '',
    });
  } catch (error) {
    toast.error('Terjadi kesalahan dalam mengambil data!');
  } finally {
    loading.value = false;
  }
});

// Fungsi simpan perubahan
const saveChanges = async () => {
  loading.value = true;
  try {
    const response = await truckStore.updateTruck(form.vehicleId, {
        ...form,
        vehicleSTNKDate: new Date(form.vehicleSTNKDate),
        vehicleKIRDate: new Date(form.vehicleKIRDate),
        vehicleBizLicenseDate: form.vehicleBizLicenseDate ? new Date(form.vehicleBizLicenseDate) : null,
        vehicleDispensationDate: form.vehicleDispensationDate ? new Date(form.vehicleDispensationDate) : null,
    });

    if (response.success) {
      toast.success("Truck berhasil diperbarui!");
      router.push('/trucks'); // Redirect ke daftar truck
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error("Terjadi kesalahan saat memperbarui truck.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Edit Truck" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="router.back()">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Edit Truck</h1>
            </div>
          </div>

          <form @submit.prevent="saveChanges">
            <div class="form-grid">
              
              <!-- Vehicle ID (Hidden) -->
              <input v-model="form.vehicleId" type="hidden" id="vehicleId" />

              <!-- Brand -->
              <div class="form-group">
                <label for="vehicleBrand">Brand</label>
                <input v-model="form.vehicleBrand" type="text" id="vehicleBrand" required />
              </div>

              <!-- Division -->
              <div class="form-group">
                <label for="division">Division</label>
                <input v-model="form.division" type="text" id="division" maxlength="2" required />
              </div>

              <!-- Tahun -->
              <div class="form-group">
                <label for="vehicleYear">Year</label>
                <input v-model="form.vehicleYear" type="text" id="vehicleYear" maxlength="4" pattern="\d{4}" required />
              </div>

              <!-- Nomor Plat -->
              <div class="form-group">
                <label for="vehiclePlateNo">Plate Number</label>
                <input v-model="form.vehiclePlateNo" type="text" id="vehiclePlateNo" required />
              </div>

              <!-- Nomor STNK -->
              <div class="form-group">
                <label for="vehicleSTNKDate">STNK Expiration Date</label>
                <input v-model="form.vehicleSTNKDate" type="date" id="vehicleSTNKDate" required />
              </div>

              <!-- Nomor KIR -->
              <div class="form-group">
                <label for="vehicleKIRNo">KIR No.</label>
                <input v-model="form.vehicleKIRNo" type="text" id="vehicleKIRNo" required />
              </div>

              <!-- Tanggal KIR -->
              <div class="form-group">
                <label for="vehicleKIRDate">KIR Expiration Date</label>
                <input v-model="form.vehicleKIRDate" type="date" id="vehicleKIRDate" required />
              </div>

              <!-- Vehicle Type -->
              <div class="form-group">
                <label for="vehicleType">Vehicle Type</label>
                <input v-model="form.vehicleType" type="text" id="vehicleType"  />
              </div>

              <!-- Cylinder -->
              <div class="form-group">
                <label for="vehicleCylinder">Cylinder</label>
                <input v-model="form.vehicleCylinder" type="text" id="vehicleCylinder" />
              </div>

              <!-- Chassis No -->
              <div class="form-group">
                <label for="vehicleChassisNo">Chassis No.</label>
                <input v-model="form.vehicleChassisNo" type="text" id="vehicleChassisNo" />
              </div>

              <!-- Engine No -->
              <div class="form-group">
                <label for="vehicleEngineNo">Engine No.</label>
                <input v-model="form.vehicleEngineNo" type="text" id="vehicleEngineNo" />
              </div>

              <!-- Business License No -->
              <div class="form-group">
                <label for="vehicleBizLicenseNo">Business License No.</label>
                <input v-model="form.vehicleBizLicenseNo" type="text" id="vehicleBizLicenseNo" />
              </div>

              <!-- Business License Date -->
              <div class="form-group">
                <label for="vehicleBizLicenseDate">Business License Date</label>
                <input v-model="form.vehicleBizLicenseDate" type="date" id="vehicleBizLicenseDate" />
              </div>

              <!-- Vehicle Number -->
              <div class="form-group">
                <label for="vehicleNumber">Vehicle Number</label>
                <input v-model="form.vehicleNumber" type="text" id="vehicleNumber" maxlength="6" />
              </div>

              <!-- Keterangan -->
              <div class="form-group full-width">
                <label for="vehicleRemarks">Remarks</label>
                <textarea v-model="form.vehicleRemarks" id="vehicleRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Perubahan" }}
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

.readonly-input {
  background-color: #f3f3f3;
  cursor: not-allowed;
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
</style>
