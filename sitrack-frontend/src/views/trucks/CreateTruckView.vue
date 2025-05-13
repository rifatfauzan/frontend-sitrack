<script setup lang="ts">
import { ref, reactive} from 'vue';
import { useTruckStore } from '@/stores/truck';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';

const truckStore = useTruckStore();
const loading = ref(false);

// State Form
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
  siteId: 'JKT',
  vehicleType: '',
  dept: 'TR',
  recordStatus: 'A',
  rowStatus: 'A',
  division: '01',
  vehicleNumber: '',
  vehicleFuelConsumption: "0.0",
  vehicleGroup: '',
});


// Fungsi submit form
const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  try {
    const response = await truckStore.addTruck({
      ...form,
      vehicleSTNKDate: new Date(form.vehicleSTNKDate),
      vehicleKIRDate: new Date(form.vehicleKIRDate),
      vehicleBizLicenseDate: form.vehicleBizLicenseDate ? new Date(form.vehicleBizLicenseDate) : null,
      vehicleDispensationDate: form.vehicleDispensationDate ? new Date(form.vehicleDispensationDate) : null,
    });

    if (response.success) {
      showSuccess.value = true;
      resetForm();
    } else {
      errorMessage.value = response.message || "Gagal menyimpan!";
      showError.value = true;
    }
  } catch {
    errorMessage.value = "Terjadi kesalahan saat menyimpan data!";
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/trucks');
};

// Fungsi reset form
const resetForm = () => {
  Object.assign(form, {
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
    siteId: 'JKT',
    vehicleType: '',
    dept: 'TR',
    rowStatus: 'A',
    recordStatus: 'A', 
    division: '01',
    vehicleNumber: '',
    vehicleFuelConsumption: 0.0,
    vehicleGroup: '',
  });
};

const goToList = () => {
    showSuccess.value = false;
    router.push('/trucks');
  };

const confirmSubmit = () => {
  showConfirm.value = true;
};

const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Buat Vehicle" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                        <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Vehicle</h1>
            </div>
          </div>

          <form @submit.prevent="confirmSubmit">
            <div class="form-grid">
              
              <!-- Vehicle ID (Hidden) -->
              <input v-model="form.vehicleId" type="hidden" id="vehicleId"/>

              <!-- Brand -->
              <div class="form-group">
                <label for="vehicleBrand">Brand <span class="required">*</span></label>
                <input v-model="form.vehicleBrand" type="text" id="vehicleBrand" maxlength="20" required />
              </div>

              <!-- Division -->
              <div class="form-group">
                <label for="division">Division <span class="required">*</span></label>
                <input v-model="form.division" type="text" id="division" maxlength="2" pattern="\d{2}" title="Division harus 2 digit angka" required />
              </div>

              <!-- Tahun -->
              <div class="form-group">
                <label for="vehicleYear">Year <span class="required">*</span></label>
                <input v-model="form.vehicleYear" type="text" id="vehicleYear" maxlength="4" pattern="\d{4}" title="Year harus 4 digit angka" required />
              </div>

              <!-- Nomor Plat -->
              <div class="form-group">
                <label for="vehiclePlateNo">Plate Number <span class="required">*</span></label>
                <input v-model="form.vehiclePlateNo" type="text" id="vehiclePlateNo" maxlength="10" required />
              </div>

              <!-- Nomor STNK -->
              <div class="form-group">
                <label for="vehicleSTNKDate">STNK Expiration Date <span class="required">*</span></label>
                <input v-model="form.vehicleSTNKDate" type="date" id="vehicleSTNKDate" required />
              </div>

              <!-- Nomor KIR -->
              <div class="form-group">
                <label for="vehicleKIRNo">KIR No. <span class="required">*</span></label>
                <input v-model="form.vehicleKIRNo" type="text" id="vehicleKIRNo" maxlength="20" required />
              </div>

              <!-- Tanggal KIR -->
              <div class="form-group">
                <label for="vehicleKIRDate">KIR Expiration Date <span class="required">*</span></label>
                <input v-model="form.vehicleKIRDate" type="date" id="vehicleKIRDate" required />
              </div>

              <!-- Site ID -->
              <div class="form-group">
                <label for="siteId">Site ID <span class="required">*</span></label>
                <input v-model="form.siteId" type="text" id="siteId" maxlength="3" pattern="^[A-Z]{3}$" title="Site ID max 3 huruf kapital" required />
              </div>

              <!-- Vehicle Type -->
              <div class="form-group">
                <label for="vehicleType">Vehicle Type <span class="required">*</span></label>
                <input v-model="form.vehicleType" type="text" id="vehicleType" maxlength="20" required/>
              </div>

              <!-- Cylinder -->
              <div class="form-group">
                <label for="vehicleCylinder">Cylinder</label>
                <input v-model="form.vehicleCylinder" type="text" id="vehicleCylinder" maxlength="5"/>
              </div>

              <!-- Chassis No -->
              <div class="form-group">
                <label for="vehicleChassisNo">Chassis No.</label>
                <input v-model="form.vehicleChassisNo" type="text" id="vehicleChassisNo" maxlength="20" />
              </div>

              <!-- Engine No -->
              <div class="form-group">
                <label for="vehicleEngineNo">Engine No.</label>
                <input v-model="form.vehicleEngineNo" type="text" id="vehicleEngineNo" maxlength="20"/>
              </div>

              <!-- Business License No -->
              <div class="form-group">
                <label for="vehicleBizLicenseNo">Business License No.</label>
                <input v-model="form.vehicleBizLicenseNo" type="text" id="vehicleBizLicenseNo" maxlength="20"/>
              </div>

              <!-- Business License Date -->
              <div class="form-group">
                <label for="vehicleBizLicenseDate">Business License Date</label>
                <input v-model="form.vehicleBizLicenseDate" type="date" id="vehicleBizLicenseDate" />
              </div>

              <!-- Dispensation No -->
              <div class="form-group">
                <label for="vehicleDispensationNo">Vehicle Dispensation No.</label>
                <input v-model="form.vehicleDispensationNo" type="text" id="vehicleDispensationNo" maxlength="20"/>
              </div>

              <!-- Dispensation Date -->
              <div class="form-group">
                <label for="vehicleDispensationDate">Vehicle Dispensation Date</label>
                <input v-model="form.vehicleDispensationDate" type="date" id="vehicleDispensationDate" />
              </div>

              <!-- Vehicle Number -->
              <div class="form-group">
                <label for="vehicleNumber">Vehicle Number</label>
                <input v-model="form.vehicleNumber" type="text" id="vehicleNumber" maxlength="6"  pattern="^\d{1,6}$" title="Vehicle Number max 6 characters"/>
              </div>

              <!-- Dept -->
              <div class="form-group">
                <label for="dept">Dept</label>
                <input v-model="form.dept" type="text" id="dept" maxlength="2" pattern="^[A-Z]{2}$" title="Dept harus 2 huruf kapital" />
              </div>

              <!-- Record Status -->
              <div class="form-group">
                <label for="recordStatus">Record Status</label>
                <input v-model="form.recordStatus" type="text" id="recordStatus" maxlength="1" pattern="[A-Z]{1}" title="record status harus huruf kapital A-C" />
              </div>

              <!-- Vehicle Fuel Consumption -->
              <div class="form-group">
                <label for="vehicleFuelConsumption">Fuel Consumption</label>
                <input 
                  v-model="form.vehicleFuelConsumption" 
                  type="number" 
                  id="vehicleFuelConsumption"
                  step="0.1" 
                  min="0" 
                  max="999.9"
                  title="fuel consumption min 0.0 max 99.9 dengan 1 angka di belakang koma"
                  required
                />
              </div>

              <!-- Vehicle Group -->
              <div class="form-group">
                <label for="vehicleGroup">Vehicle Group</label>
                <select v-model="form.vehicleGroup" id="vehicleGroup">
                  <option value="">Tidak Ada</option>
                  <option value="H">Heavy Truck</option>
                  <option value="M">Medium Truck</option>
                  <option value="L">Light Truck</option>
                  <option value="B">Box Truck</option>
                  <option value="R">Refrigerated Truck</option>
                  <option value="T">Trailer</option>
                  <option value="S">Special Purpose Truck</option>
                </select>
              </div>

              <!-- Keterangan -->
              <div class="form-group full-width">
                <label for="vehicleRemarks">Remarks</label>
                <textarea v-model="form.vehicleRemarks" id="vehicleRemarks" maxlength="300"></textarea>
              </div>
            </div>

            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Buat Truck" }}
            </VButton>
          </form>
        </div>
      </div>
      <FooterComponent />
    </div>
    <ConfirmationDialog
      :visible="showConfirm"
      @close="showConfirm = false"
      @confirm="submitForm"
      :message="'Apakah data truck sudah sesuai?'"
    />

    <SuccessDialog 
      :visible="showSuccess" 
      @close="goToList" 
      :message="'Truck baru berhasil terdaftar!'" 
      redirectTo="/trucks"
      buttonText="Kembali ke List Truck" 
    />

    <ErrorDialog
      :visible="showError"
      @close="showError = false"
      :message="errorMessage"
    />
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

.required {
  color: red;
  margin-left: 4px;
}

</style>
