<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Edit Surat Perintah Jalan" />
        <div class="flex-1 p-4 main-content overflow-auto">
          <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            
            <div class="header-container">
              <div class="header-content">
                <VButton title="" class="back-button" @click="goBack">
                  <i class="pi pi-arrow-left"></i>
                </VButton>
                <h1 class="header-title">Edit SPJ</h1>
              </div>
            </div>
  
            <form @submit.prevent="confirmSubmit">
              <div class="form-grid">
                <div class="form-group">
                  <label for="customer">Customer <span class="text-red-500">*</span></label>
                  <input v-model="form.customerId" type="text" id="customerId" class="readonly-input" readonly />
                </div>
                

                <div class="form-group">
                  <label for="othersCommission">Other Commision <span class="text-red-500">*</span></label>
                  <input v-model="form.othersCommission" type="number" id="othersCommission" required />
                </div>

  
                <div class="form-group">
                  <label>Date Out<span class="text-red-500">*</span></label>
                  <input v-model="form.dateOut" type="date"  />
                </div>
  
                <div class="form-group">
                  <label>Date In<span class="text-red-500">*</span></label>
                  <input v-model="form.dateIn" type="date"  />
                </div>
  
                <div class="form-group">
                  <label>Chassis Size<span class="text-red-500">*</span></label>
                  <select v-model="selectedChassisSize" required @change="filterChassisOptions">
                    <option value="" disabled>Pilih Chassis Size</option>
                    <option v-for="size in availableChassisSizes" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
  
                <div class="form-group">
                  <label>Chassis<span class="text-red-500">*</span></label>
                  <select v-model="form.chassisId" required >
                    <option value="" >Pilih Chassis</option>
                    <option v-for="chassis in filteredChassisList" :key="chassis.chassisId" :value="chassis.chassisId">
                      {{ chassis.chassisId }}
                    </option>
                  </select>
                </div>

  
                <div class="form-group">
                  <label>Container Type<span class="text-red-500">*</span></label>
                  <select v-model="form.containerType" required >
                    <option value="" >Pilih Container</option>
                    <option v-for="type in availableContainerTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>
  
                <div class="form-group">
                  <label>Container Qty<span class="text-red-500">*</span></label>
                  <input v-model.number="form.containerQty" type="number" min="1"  />
                </div>
  
                <div class="form-group">
                  <label>Driver<span class="text-red-500">*</span></label>
                  <select v-model="form.driverId" required >
                    <option value="" disabled>Pilih Sopir</option>
                    <option v-for="sopir in availableSopirs" :key="sopir.driverId" :value="sopir.driverId">
                        {{ sopir.driverName }}
                    </option>
                  </select>
                </div>
  
                <div class="form-group">
                  <label>Vehicle<span class="text-red-500">*</span></label>
                  <select v-model="form.vehicleId" required >
                    <option value="" disabled>Pilih Truck</option>
                    <option v-for="truck in availableTrucks" :key="truck.vehicleId" :value="truck.vehicleId">
                        {{ truck.vehicleId }}
                    </option>
                  </select>
                </div>
              </div>
  
              <div class="form-group full-width">
                <label>Remarks Operasional</label>
                <textarea v-model="form.remarksOperasional" rows="3" />
              </div>
  
              <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
                {{ loading ? "Menyimpan..." : "Simpan Surat Perintah Jalan" }}
              </VButton>
            </form>
  
          </div>
        </div>
  
        <ConfirmationDialog
          :visible="showConfirm"
          @close="showConfirm = false"
          @confirm="submitForm"
          :message="'Apakah data SPJ sudah sesuai?'"
        />
  
        <SuccessDialog
          :visible="showSuccess"
          @close="goToList"
          :message="'SPJ berhasil dibuat!'"
          redirectTo="/vehicle-out"
          buttonText="Kembali ke List SPJ"
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
  
  <script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue';
  import Sidebar from '@/components/vSidebar.vue';
  import HeaderComponent from '@/components/vHeader.vue';
  import FooterComponent from '@/components/vFooter.vue';
  import VButton from '@/components/VButton.vue';
  import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
  import SuccessDialog from '@/components/SuccessDialog.vue';
  import ErrorDialog from '@/components/ErrorDialog.vue';
  import { useTruckStore } from '@/stores/truck';
  import { useChassisStore } from '@/stores/chassis';
  import { useSopirStore } from '@/stores/sopir';
  import { useSpjStore } from '@/stores/spj';
  import router from '@/router';

import { useRoute } from 'vue-router';
  
  const truckStore = useTruckStore();
  const chassisStore = useChassisStore();
  const sopirStore = useSopirStore();
  const spjStore = useSpjStore();
  const route = useRoute();
  

  const availableChassisSizes = ref<number[]>([]);
  const availableContainerTypes = ref<string[]>([]);
  const availableChassis = ref<Map<number, number>>(new Map());
  const availableContainerQty = ref<Map<string, number>>(new Map());
const originalContainerType = ref<string>('');
const originalContainerQty   = ref<number>(0);
  const selectedChassisSize = ref<number | null>(null);
  
  const form = reactive({
    spjId: '',
    orderId: '',
    customerId: '',
    vehicleId: '',
    chassisId: '',
    driverId: '',
    chassisSize: 0,
    containerType: '',
    containerQty: 0,
    dateOut: undefined,
    dateIn: undefined,
    othersCommission: 0,
    remarksOperasional: '',
  });
  
  const loading = ref(false);
  const showConfirm = ref(false);
  const showSuccess = ref(false);
  const showError = ref(false);
  const errorMessage = ref('');
  
  const availableTrucks = computed(() => truckStore.truckList.filter(truck => truck.rowStatus === 'A' || truck.rowStatus === 'I' && truck.vehicleId === form.vehicleId));
  const availableSopirs = computed(() => sopirStore.sopirs.filter(sopir => sopir.rowStatus === 'A' || sopir.rowStatus === 'I' && sopir.driverId === form.driverId));
  const filteredChassisList = computed(() =>
    chassisStore.chassisList.filter(ch => ch.rowStatus === 'A' && (Number(ch.chassisSize) === selectedChassisSize.value) || (ch.rowStatus === 'I' && ch.chassisId === form.chassisId &&(Number(ch.chassisSize) === selectedChassisSize.value) ) )
  );
  

  
  onMounted(async () => {
  const spjId = route.params.spjId as string;
  if (!spjId){
      router.push('/vehicle-out');
      return;
  }

  loading.value = true;
  try {

      await Promise.all([
          truckStore.fetchTrucks(),
          chassisStore.fetchChassis(),
          sopirStore.fetchSopirs()
      ]);


      const spjData = await spjStore.fetchSpjById(spjId);
      if (!spjData) {
          router.push('/vehicle-out');
          return;
      }


      Object.assign(form, {
          ...spjData,
          spjId: spjData.id,
          orderId: spjData.orderId,
          customerId: spjData.customerId,
          vehicleId: spjData.vehicleId,
          chassisId: spjData.chassisId,
          driverId: spjData.driverId,
          chassisSize: spjData.chassisSize,
          containerType: spjData.containerType,
          containerQty: spjData.containerQty,
          dateOut: spjData.dateOut,
          dateIn: spjData.dateIn,
          othersCommission: spjData.othersCommission,
          remarksOperasional: spjData.remarksOperasional
      });
      selectedChassisSize.value = form.chassisSize;
      originalContainerType.value = spjData.containerType;
      originalContainerQty.value  = spjData.containerQty;

      const orderId = spjData.orderId;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/spj/available/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const resData = await res.json();
      const data = resData.data;

      availableChassisSizes.value = [];
      availableContainerTypes.value = [];
      availableChassis.value.clear();
      availableContainerQty.value.clear();

      if (data.chassis20 > 0) availableChassisSizes.value.push(20);
      if (data.chassis40 > 0) availableChassisSizes.value.push(40);

      for (const [key, qty] of Object.entries(data)) {
          if (Number(qty) > 0 && key !== 'chassis20' && key !== 'chassis40') {
              availableContainerTypes.value.push(key);
              availableContainerQty.value.set(key, Number(qty));
          }
      }

      if (
        form.containerType &&
        !availableContainerTypes.value.includes(form.containerType)
        ) {
        availableContainerTypes.value.push(form.containerType);
        }

      if (form.chassisSize && !availableChassisSizes.value.includes(form.chassisSize) ) {
        const matchingChassis = chassisStore.chassisList.find(chassis => chassis.chassisId === form.chassisId);
  
        if (matchingChassis && Number(matchingChassis.chassisSize) === form.chassisSize) {
                availableChassisSizes.value.push(form.chassisSize);
            }
        }
  } catch  {
  } finally {
      loading.value = false;
  }
});

  
  
  function filterChassisOptions() {
    form.chassisId = '';
  }
  
  async function confirmSubmit() {
    showConfirm.value = true;
  }
  
  async function submitForm() {
  showConfirm.value = false;
  loading.value = true;
  try {
      const maxContainer = form.chassisSize === 20 ? 1 : 2;
      if (form.containerQty > maxContainer) {
          throw new Error(`Maksimal ${maxContainer} container untuk chassis size ${form.chassisSize}`);
      }

      const unchangedContainer = form.containerType === originalContainerType.value && form.containerQty === originalContainerQty.value;

      if (!unchangedContainer){
          const containerAvailable = availableContainerQty.value.get(form.containerType) || 0;
    
          if (form.containerQty > containerAvailable ) {
              throw new Error(`Sisa container hanya ${containerAvailable}`);
          }
      }
      form.chassisSize = selectedChassisSize.value!;
      await spjStore.editSpj(form.spjId, form);
      showSuccess.value = true;
  } catch (err) {
      errorMessage.value = (err as Error).message || 'Gagal membuat SPJ';
      showError.value = true;
  } finally {
      loading.value = false;
  }
}

  
  const goToList = () => {
    showSuccess.value = false;
    router.push('/vehicle-out');
  };
  
  const goBack = () => router.back();
  </script>
  
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

  input:disabled,
  select:disabled,
  textarea:disabled {
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
  