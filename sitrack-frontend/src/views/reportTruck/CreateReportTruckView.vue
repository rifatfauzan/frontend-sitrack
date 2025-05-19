<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAssetStore } from '@/stores/asset';
import { useTruckStore } from '@/stores/truck';
import { useReportTruckStore } from '@/stores/reportTruck';

import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import Dropdown from 'primevue/dropdown';

const router = useRouter();
const truckStore = useTruckStore();
const assetStore = useAssetStore();
const reportTruckStore = useReportTruckStore();
const { assetList } = storeToRefs(assetStore);
const { truckList } = storeToRefs(truckStore);

const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');
const loading = ref(false);

const form = reactive({
  vehicleId: '',
  date: new Date().toISOString().split('T')[0],
  startRepair: '',
  finishRepair: '',
  description: '',
  selectedAssetId: '',
  quantity: 0,
  assets: [] as { assetId: string; quantity: number }[],
});

onMounted(async () => {
  await truckStore.fetchTrucks();
  await assetStore.fetchAssets();
});

const selectedVehicleType = computed(() => {
  const selectedTruck = truckList.value.find(t => t.vehicleId === form.vehicleId)
  return selectedTruck?.vehicleType || '-'
})

const selectedVehicleBrand = computed(() => {
  const selectedTruck = truckList.value.find(t => t.vehicleId === form.vehicleId)
  return selectedTruck?.vehicleBrand|| '-'
})

const truckOptions = computed(() =>
  truckList.value.map((t) => ({
    label: `${t.vehicleId} - ${t.vehiclePlateNo}`,
    value: t.vehicleId,
  }))
);

const assetOptions = computed(() =>
  assetList.value.map((a) => ({
    label: `${a.assetId} - ${a.jenisAsset} (${a.brand})`,
    value: a.assetId,
  }))
);

const addAsset = () => {
  if (!form.selectedAssetId) return;
  if (form.assets.some((a) => a.assetId === form.selectedAssetId)) return;
  if (form.quantity < 1) return;

  form.assets.push({
    assetId: form.selectedAssetId,
    quantity: form.quantity,
  });

  form.selectedAssetId = '';
  form.quantity = 0;
};

const removeAsset = (index: number) => {
  form.assets.splice(index, 1);
};

const confirmSubmit = () => {
  if (!form.vehicleId || !form.date || !form.startRepair || !form.finishRepair) {
    errorMessage.value = 'Mohon lengkapi semua field yang wajib diisi.';
    showError.value = true;
    return;
  }
  const today = new Date().setHours(0, 0, 0, 0);
  const startRepairDate = new Date(form.startRepair).setHours(0, 0, 0, 0);
  const finishRepairDate = new Date(form.finishRepair).setHours(0, 0, 0, 0);

  if (startRepairDate > today) {
    errorMessage.value = 'Tanggal Start Repair hanya bisa di masa lampau';
    showError.value = true;
    return;
  }

  if (finishRepairDate > today) {
    errorMessage.value = 'Tanggal Finish Repair hanya bisa di masa lampau atau hari ini';
    showError.value = true;
    return;
  }
  
  showConfirm.value = true;
};

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  try {
    const payload = {
      ...form,
      assets: form.assets.map((a) => ({ assetId: a.assetId, quantity: a.quantity })),
    };
    const res = await reportTruckStore.createReportTruck(payload);
    if (res.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = res.message;
      showError.value = true;
    }
  } catch (err) {
    errorMessage.value = 'Gagal mengirim data';
    showError.value = true;
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.push('/report-truck');
const goToList = () => router.push('/report-truck');
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen bg-[#C8D9ED]">
      <HeaderComponent title="Buat Vehicle Maintenance Report" />
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Vehicle Maintenance Report</h1>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold">Vehicle<span class="required">*</span></label>
              <Dropdown
                v-model="form.vehicleId"
                :options="truckOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="-- Pilih Vehicle --"
                class="w-full"
              />
            </div>
            <div>
              <label class="block font-bold">Vehicle Brand</label>
              <input
                type="text"
                :value="selectedVehicleBrand"
                class="w-full border rounded px-3 py-2 bg-gray-100"
                readonly
              />
            </div>
            <div>
              <label class="block font-bold">Vehicle Type</label>
              <input
                type="text"
                :value="selectedVehicleType"
                class="w-full border rounded px-3 py-2 bg-gray-100"
                readonly
              />
            </div>
            <div>
              <label class="block font-bold">Tanggal<span class="required">*</span></label>
              <input type="date" v-model="form.date" class="w-full border rounded px-3 py-2" required/>
            </div>
            <div>
              <label class="block font-bold">Start Repair<span class="required">*</span></label>
              <input type="date" v-model="form.startRepair" class="w-full border rounded px-3 py-2" required/>
            </div>
            <div>
              <label class="block font-bold">Finish Repair<span class="required">*</span></label>
              <input type="date" v-model="form.finishRepair" class="w-full border rounded px-3 py-2" required/>
            </div>
          </div>

          <hr />

          <div>
            <label class="font-bold block mb-1">Pilih Asset</label>
            <Dropdown
              v-model="form.selectedAssetId"
              :options="assetOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="-- Pilih Asset --"
              filter
              class="w-full"
            />
          </div>

          <div>
            <label class="font-bold block mb-1">Jumlah</label>
            <input type="number" v-model.number="form.quantity" min="1" class="w-full border rounded px-3 py-2" />
          </div>

          <VButton class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="addAsset">
            Tambah Asset
          </VButton>

          <div v-if="form.assets.length > 0">
            <table class="w-full mt-6 border-collapse">
              <thead class="bg-[#1C5D99] text-white">
                <tr>
                  <th class="p-2">No.</th>
                  <th class="p-2">ID</th>
                  <th class="p-2">Type</th>
                  <th class="p-2">Brand</th>
                  <th class="p-2">Jumlah</th>
                  <th class="p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.assets" :key="item.assetId" class="odd:bg-gray-100 even:bg-white text-center">
                  <td class="p-2">{{ index + 1 }}</td>
                  <td class="p-2">{{ item.assetId }}</td>
                  <td class="p-2">{{ assetList.find(a => a.assetId === item.assetId)?.jenisAsset || '-' }}</td>
                  <td class="p-2">{{ assetList.find(a => a.assetId === item.assetId)?.brand || '-' }}</td>
                  <td class="p-2">{{ item.quantity }}</td>
                  <td class="p-2">
                    <button @click="removeAsset(index)" class="text-red-500 hover:underline">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <label class="font-bold block mb-1">Description</label>
            <textarea v-model="form.description" class="w-full border rounded px-3 py-2" rows="3" placeholder="Keterangan perbaikan (opsional)..." maxlength="300" />
          </div>

          <VButton class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" @click="confirmSubmit" :disabled="loading">
            {{ loading ? 'Menyimpan...' : 'Buat Vehicle Maintenance' }}
          </VButton>
        </div>
      </div>
      <FooterComponent />

      <ConfirmationDialog 
        :visible="showConfirm" 
        @close="showConfirm = false" 
        @confirm="submitForm" :message="'Apakah data sudah sesuai?'" 
        />

      <SuccessDialog 
        :visible="showSuccess" 
        @close="goToList" 
        :message="'Laporan berhasil dibuat!'" 
        redirectTo="/report-truck" 
        buttonText="Kembali ke List" 
        />

      <ErrorDialog 
        :visible="showError" 
        @close="showError = false" 
        :message="errorMessage" 
        />
        
    </div>
  </div>
</template>

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
