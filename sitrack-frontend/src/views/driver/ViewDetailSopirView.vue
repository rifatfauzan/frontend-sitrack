<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSopirStore } from '@/stores/sopir';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';
import type { Sopir } from '@/interfaces/sopir.interfaces';

const route = useRoute();
const router = useRouter();
const sopirStore = useSopirStore();
const { loading } = storeToRefs(sopirStore);
const driverDetail = ref<Sopir | null>(null);

// Ambil ID dari parameter
const driverId = route.params.driverId as string;

// Fetch data sopir saat komponen dimuat
onMounted(async () => {
  if (driverId) {
    const result = await sopirStore.getSopirById(driverId);
    driverDetail.value = result ?? null;
  }
});

// const formatDate = (date: string | Date): string => {
//   if (!date) return '-';
//   const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
//   const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
//   return formattedDate;
// };

// Navigasi kembali ke daftar chassis
const goBack = () => {
  router.push('/sopir/viewall');
};

const getExpirationClass = (expirationDate: string | null): string => {
  if (!expirationDate) return '';

  const expDate = new Date(expirationDate);
  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);
  expDate.setHours(0, 0, 0, 0);

  const timeDifference = expDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (daysRemaining < 0 || daysRemaining === 0) {
    return 'bg-red-100';
  } else if (daysRemaining <= 30) {
    return 'bg-yellow-100';
  } else {
    return '';
  }
};
// Navigasi ke halaman edit
const goToEdit = () => {
  router.push({ name: 'update sopir', params: { driverId } });
};
</script>

<template>
    <div class="flex h-screen overflow-auto">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Detail Driver" />
  
        <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
          <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
          </div>
  
          <div v-else-if="driverDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">

                <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                </VButton>

                <h1 class="text-2xl font-bold">{{ driverDetail.driverId }}</h1>
              </div>
              <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
            </div>
  
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="detail-item"><span>Driver Name</span><strong>{{ driverDetail.driverName || '-' }}</strong></div>
                <div class="detail-item alt"><span>Driver KTP Number</span><strong>{{ driverDetail.driver_KTP_No || '-' }}</strong></div>
                <div class="detail-item alt"><span>Driver SIM Number</span><strong>{{ driverDetail.driver_SIM_No || '-' }}</strong></div>
                <!-- <div class="detail-item"><span>Driver SIM Date</span><strong>{{ driverDetail.driver_SIM_Date || '-' }}</strong></div> -->

                <div :class="['detail-item', getExpirationClass(driverDetail.driver_SIM_Date)]">
                  <span>SIM Date</span>
                  <strong>{{(driverDetail.driver_SIM_Date) || '-' }}</strong>
                </div>
                <div class="detail-item alt"><span>Co Driver Name</span><strong>{{ driverDetail.driverCo || '-' }}</strong></div>
                <div class="detail-item"><span>Co Driver Contact</span><strong>{{ driverDetail.driverCoContact || '-' }}</strong></div>
                <div class="detail-item"><span>Driver Contact</span><strong>{{ driverDetail.driverContact || '-' }}</strong></div>
                <div class="detail-item"><span>Driver Type</span><strong>{{ driverDetail.driverType || '-' }}</strong></div>
              </div>
  
              <div class="space-y-3">
                <!-- <div class="detail-item"><span>Driver Number</span><strong>{{ driverDetail.driverNumber || '-' }}</strong></div> -->
                <div class="detail-item alt"><span>Record Status</span><strong>{{ driverDetail.recordStatus || '-' }}</strong></div>
                <div class="detail-item"><span>Row Status</span><strong>{{ driverDetail.rowStatus || '-' }}</strong></div>
                <div class="detail-item alt"><span>Site</span><strong>{{ driverDetail.siteId || '-' }}</strong></div>
                <div class="detail-item"><span>Created by</span><strong>{{ driverDetail.createdBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Created Date</span><strong>{{ driverDetail.createdDate || '-' }}</strong></div>
                <div class="detail-item"><span>Updated by</span><strong>{{ driverDetail.updatedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Updated Date</span><strong>{{ driverDetail.updatedDate || '-' }}</strong></div>
                <div class="detail-item"><span>Driver Join Date</span><strong>{{ driverDetail.driverJoinDate || '-' }}</strong></div>
              </div>
            </div>
  
            <div class="detail-remarks">
                <span class="label">Remarks</span>
                <p class="text">{{ driverDetail.driverRemarks || '-' }}</p>
            </div>

          </div>
  
          <div v-else class="text-center text-red-500 font-semibold">
            Driver tidak ditemukan.
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
    .w-full.max-w-5xl {
    flex-grow: 1; /* Memastikan dia mengisi ruang yang tersedia */
    max-height: calc(100vh - 100px); /* Sesuaikan dengan viewport */
    overflow-y: auto; /* Scroll jika kontennya terlalu panjang */
    display: flex;
    flex-direction: column;
    }

    .bg-red-100 {
      background-color: #EB5757;
      color: #222222;
    }

    .bg-yellow-100 {
      background-color: #F7B500;
      color: #222222;
    }

  </style>
  