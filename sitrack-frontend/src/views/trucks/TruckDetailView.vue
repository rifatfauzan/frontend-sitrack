<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTruckStore } from '@/stores/truck';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';

const route = useRoute();
const router = useRouter();
const truckStore = useTruckStore();
const { loading } = storeToRefs(truckStore);
const truckDetail = ref<any>(null);

// Ambil ID dari query parameter
const vehicleId = route.query.id as string;

// Fetch data truck saat komponen dimuat
onMounted(async () => {
  if (vehicleId) {
    const response = await truckStore.getTruckById(vehicleId);
    console.log("📌 API Response:", response);
    truckDetail.value = response;
  }
});

// Navigasi ke halaman edit truck
const goToEdit = () => {
  router.push({ name: 'edit truck', query: { id: vehicleId } });
};

const goBack = () => {
    router.push('/trucks');
};
</script>

<template>
  <div class="flex h-screen overflow-auto">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Detail Vehicle" />

      <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
          <Skeleton width="100%" height="2rem" class="mb-4" />
          <Skeleton width="100%" height="2rem" class="mb-4" />
          <Skeleton width="100%" height="2rem" class="mb-4" />
        </div>

        <!-- Data Truck -->
        <div v-else-if="truckDetail" class="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center space-x-4">
              <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
              </VButton>

              <h1 class="text-2xl font-bold">{{ truckDetail.vehicleId }}</h1>
              <span class="text-lg">{{ truckDetail.vehicleBrand || '-' }}</span>
            </div>
            <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="detail-item"><span>Year</span><strong>{{ truckDetail.vehicleYear || '-' }}</strong></div>
              <div class="detail-item alt"><span>Plate No.</span><strong>{{ truckDetail.vehiclePlateNo|| '-' }}</strong></div>
              <div class="detail-item"><span>STNK Expiration</span><strong>{{ truckDetail.vehicleSTNKDate || '-' }}</strong></div>
              <div class="detail-item alt"><span>KIR No.</span><strong>{{ truckDetail.vehicleKIRNo || '-' }}</strong></div>
              <div class="detail-item"><span>KIR Expiration</span><strong>{{ truckDetail.vehicleKIRDate || '-' }}</strong></div>
              <div class="detail-item alt"><span>Chassis No.</span><strong>{{ truckDetail.vehicleChassisNo || '-' }}</strong></div>
              <div class="detail-item"><span>Engine No.</span><strong>{{ truckDetail.vehicleEngineNo || '-' }}</strong></div>              
              <div class="detail-item alt"><span>Division</span><strong>{{ truckDetail.division || '-' }}</strong></div>
              <div class="detail-item"><span>Business License Number</span><strong>{{ truckDetail.vehicleBizLicenseNo|| '-' }}</strong></div>
              <div class="detail-item alt"><span>Business License Date</span><strong>{{ truckDetail.vehicleBizLicenseDate|| '-' }}</strong></div>
            </div>

            <div class="space-y-3">
              <div class="detail-item"><span>Vehicle Number</span><strong>{{ truckDetail.vehicleNumber || '-' }}</strong></div>
              <div class="detail-item alt"><span>Type</span><strong>{{ truckDetail.vehicleType || '-' }}</strong></div>
              <div class="detail-item"><span>Dept</span><strong>{{ truckDetail.dept || '-' }}</strong></div>
              <div class="detail-item alt"><span>Record Status</span><strong>{{ truckDetail.recordStatus || '-' }}</strong></div>
              <div class="detail-item"><span>Row Status</span><strong>{{ truckDetail.rowStatus || '-' }}</strong></div>
              <div class="detail-item alt"><span>Site</span><strong>{{ truckDetail.siteId || '-' }}</strong></div>
              <div class="detail-item"><span>Inserted by</span><strong>{{ truckDetail.insertedBy || '-' }}</strong></div>
              <div class="detail-item alt"><span>Inserted at</span><strong>{{ truckDetail.insertedDate || '-' }}</strong></div>
              <div class="detail-item"><span>Updated by</span><strong>{{ truckDetail.updatedBy || '-' }}</strong></div>
              <div class="detail-item alt"><span>Updated at</span><strong>{{ truckDetail.updatedDate || '-' }}</strong></div>
            </div>
          </div>

          <div class="detail-remarks">
            <span class="label">Remarks</span>
            <p class="text">{{ truckDetail.vehicleRemarks || '-' }}</p>
          </div>
        </div>

        <!-- Jika Data Tidak Ditemukan -->
        <div v-else class="text-center text-red-500 font-semibold">
          Truck tidak ditemukan.
        </div>
      </div>

      <FooterComponent class="mt-auto bg-white shadow-md" />
    </div>
  </div>
</template>

<style scoped>
/* Styling detail item */
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #FAFAFF;
  font-weight: 500;
  min-height: 48px;
  word-wrap: break-word;
}

/* Alternatif warna untuk setiap baris */
.detail-item.alt {
  background-color: #BBCDE5;
}

.detail-remarks {
  background-color: #FAFAFF;
  font-weight: 500;
  padding: 12px;
  margin-top: 12px;
  border-radius: 8px;
  text-align: left;
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}

.detail-remarks .label {
  display: block;  /* Supaya label ada di atas */
  font-weight: bold;
  margin-bottom: 4px;
}

.detail-remarks .text {
  display: block;
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;  /* Supaya teks panjang tetap rapi */
}

/* Warna utama dari desain sistem */
.bg-primary {
  background-color: #1C5D99;
  
}

/* Pastikan semua container dapat menyesuaikan isi */
.grid {
  width: 100%;
}

.detail-item span {
  flex: 1;
  white-space: nowrap; /* Pastikan label tetap rapi */
}

.detail-item strong {
  flex: 2;
  text-align: right;
  overflow-wrap: break-word;
  word-break: break-word;
}

/* Kontainer utama agar bisa mencapai bawah */
.w-full.max-w-6xl {
  flex-grow: 1; /* Memastikan dia mengisi ruang yang tersedia */
  max-height: calc(100vh - 100px); /* Sesuaikan dengan viewport */
  overflow-y: auto; /* Scroll jika kontennya terlalu panjang */
  display: flex;
  flex-direction: column;
}
</style>