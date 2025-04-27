<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';
import { useAssetStore } from '@/stores/asset';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import type { Asset } from '@/interfaces/asset.interface';

const route = useRoute();
const toast = useToast();
const router = useRouter();
const assetStore = useAssetStore();
const { loading } = storeToRefs(assetStore);
const assetDetail = ref<Asset | null>(null);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const assetId = route.params.assetId as string;



const fetchAssetData = async () => {
  loading.value = true;
  try {
    assetDetail.value = await assetStore.getAssetById(assetId);
  } catch  {
    toast.error('Gagal memuat data asset');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAssetData();
});

const formatDate = (assetDate: string | null) => {
  if (!assetDate) return '-'; // Cek null/undefined
  const date = new Date(assetDate);
  if (isNaN(date.getTime())) return '-'; // Kalau date invalid
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 
  return `${year}-${month}-${day}`;
};

const goToDetail = async () => {
  showSuccess.value = false;
  await nextTick();
  router.push({ name: 'detail asset', params: { assetId: assetId } }).then(() => {
    fetchAssetData();
  });
};


const goBack = () => {
  router.push('/assets');
};
const clickAddReqAsset = () => {
  showConfirm.value = true;
};

const addReqAsset = async () => {
  loading.value = true;
  showConfirm.value = false;
  if (assetDetail.value.requestedStok === 0) {
    toast.error("Oi gaada")
    errorMessage.value = "Tidak ada stok yang diminta";
    showError.value = true;
    loading.value = false;
  }else{
    try{
      const response = await assetStore.editAsset(assetId, {
        jumlahStok: assetDetail.value.jumlahStok + assetDetail.value.requestedStok,
        requestedStok: 0,
        assetId: assetDetail.value.assetId,
        jenisAsset: assetDetail.value.jenisAsset,
        brand: assetDetail.value.brand,
        assetRemark: assetDetail.value.assetRemark,
        assetPrice: assetDetail.value.assetPrice,
      });
      if (response.success) {
        showSuccess.value = true;  
      } else {
        errorMessage.value = response.message || "Terjadi kesalahan!";
        showError.value = true;
      }
    } catch {
      errorMessage.value = "Terjadi kesalahan saat menyimpan data!";
      showError.value = true;
    }finally {
      loading.value = false;
    }
  }
}


const goToEdit = () => {
  router.push({ name: 'update asset', params: { assetId } });
};
</script>

<template>
    <div class="flex h-screen overflow-auto">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Detail Asset" />
  
        <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
          <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
          </div>
  
          <div v-else-if="assetDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">

                <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                </VButton>

                <h1 class="text-2xl font-bold">{{ assetDetail.assetId }}</h1>
              </div>
              <div class="flex space-x-4">
                <VButton title="Add Requested Assets" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="clickAddReqAsset" />
                <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
              </div>
            </div>
  
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="detail-item"><span>Jenis Asset</span><strong>{{ assetDetail.jenisAsset || '-' }}</strong></div>
                <div class="detail-item alt"><span>Jumlah Stok</span><strong>{{ assetDetail.jumlahStok || '-' }}</strong></div>
                <div class="detail-item"><span>Brand</span><strong>{{ assetDetail.brand || '-' }}</strong></div>
                <div class="detail-item alt"><span> Requested Stok</span><strong>{{ assetDetail.requestedStok }}</strong></div>
                <div class="detail-item alt"><span> Asset Price (Satuan) </span><strong>Rp. {{ assetDetail.assetPrice.toLocaleString('id-ID') }}</strong></div>
              </div>

              <div class="space-y-3">
                <div class="detail-item"><span>Created By</span><strong>{{ assetDetail.createdBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Created Date</span><strong>{{ formatDate(assetDetail.createdDate) || '-' }}</strong></div>
                <div class="detail-item"><span>Updated By</span><strong>{{ assetDetail.updatedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Updated Date</span><strong>{{ formatDate(assetDetail.updatedDate )|| '-' }}</strong></div>
                </div>
            </div>
  
            <div class="detail-remarks">
                <span class="label">Asset Remarks</span>
                <p class="text">{{ assetDetail.assetRemark || '-' }}</p>
            </div>

          </div>
  
          <div v-else class="text-center text-red-500 font-semibold">
            Asset tidak ditemukan.
          </div>
        </div>
  
        <FooterComponent class="mt-auto bg-white shadow-md" />
      </div>
      <ConfirmationDialog
          :visible="showConfirm"
          @close="showConfirm = false"
          @confirm="addReqAsset"
          :message="'Apakah Anda ingin menambahkan jumlah Stok?'"/>

        <SuccessDialog 
          :visible="showSuccess" 
          @close="goToDetail" 
          :message="'Berhasil Memnambah Jumlah Stok Asset!'" 
          buttonText="Kembali ke List Asset" />

        <ErrorDialog
          :visible="showError"
          @close="showError = false"
          :message="errorMessage"/>
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

  </style>
  