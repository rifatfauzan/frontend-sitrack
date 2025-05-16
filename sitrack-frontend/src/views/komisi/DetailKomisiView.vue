<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';

import { useKomisiStore } from '@/stores/komisi';
import type { Komisi } from '@/interfaces/komisi.interface';
import { useTruckStore } from '@/stores/truck';

const route = useRoute();
const router = useRouter();
const komisiStore = useKomisiStore();
const { loading } = storeToRefs(komisiStore);
const komisiDetail = ref<Komisi>();


const truckStore = useTruckStore();
const { truckList } = storeToRefs(truckStore);

const komisiId = route.params.komisiId as string;

onMounted(async () => {
  truckStore.fetchTrucks(); 

  if (komisiId) {
    komisiDetail.value = await komisiStore.fetchKomisiById(komisiId);
  }

});

const goBack = () => {
  router.push('/komisi');
};

const goToEdit = () => {
  if (komisiDetail.value?.komisiId) {
    router.push({ name: 'edit komisi', query: { id: komisiDetail.value.komisiId } });
  }
};

function getTruckNameById(truckId: string) {
  const name = truckList.value.find(c => c.vehicleId === truckId)?.vehicleBrand || 'Unknown';
  return name.length > 18 ? name.slice(0, 18) + '...' : name;
}

const formatRupiah = (angka: number | string) => {
  if (!angka) return "Rp0,00";
  const rupiah = angka.toString().replace(/[^,\d]/g, "");
  const split = rupiah.split(",");
  const sisa = split[0].length % 3;
  let rupiahFormatted = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiahFormatted += separator + ribuan.join(".");
  }

  rupiahFormatted = split[1] ? rupiahFormatted + "," + split[1] : rupiahFormatted;
  return "Rp" + rupiahFormatted;
};


const goToDetail = () => {
  router.go(0);
};

</script>

<template>
      <div class="flex h-screen overflow-auto">
        <Sidebar />
        <div class="flex-1 flex flex-col min-h-screen">
          <HeaderComponent title="Commission Detail" />
    
          <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
            <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
              <Skeleton width="100%" height="2rem" class="mb-4" />
              <Skeleton width="100%" height="2rem" class="mb-4" />
              <Skeleton width="100%" height="2rem" class="mb-4" />
              <Skeleton width="100%" height="2rem" class="mb-4" />
            </div>
    
            <div v-else-if="komisiDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">

                <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                </VButton>

                <h1 class="text-2xl font-bold">{{ komisiDetail.komisiId }}</h1>
              </div>
              <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
            </div>
  
              <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-3">
                        <div class="detail-item"><span>Commission ID</span><strong>{{ komisiDetail.komisiId || '-' }}</strong></div>
                      <div class="detail-item alt"><span>Truck Id</span><strong>{{ komisiDetail.truckId || '-' }}</strong></div>                    
                      <div class="detail-item "><span> Location </span><strong>{{ komisiDetail.location || '-' }}</strong></div>
                      <div class="detail-item alt"><span>Commission Fee</span><strong>{{ formatRupiah(komisiDetail.commissionFee) ?? '-' }}</strong></div>
                      <div class="detail-item  "><span>Truck Commission</span><strong>{{ formatRupiah(komisiDetail.truckCommission) || '-' }}</strong></div>

                    </div>

                    <div class="space-y-3">
                      <div class="space-y-3">
                      <div class="detail-item ">
                      <span>Vehicle Name</span>
                      <strong>{{ getTruckNameById(komisiDetail.truckId) }}</strong></div> 
                      <div class="detail-item alt"><span>Created By </span><strong>{{ komisiDetail.createdBy || '-' }}</strong></div> 
                      <div class="detail-item "><span>Created Date </span><strong>{{ komisiDetail.createdDate || '-' }}</strong></div>     
                      <div class="detail-item alt"><span>Updated By </span><strong>{{ komisiDetail.updatedBy || '-' }}</strong></div>     
                      <div class="detail-item "><span>Updated Date</span><strong>{{ komisiDetail.updatedDate || '-' }}</strong></div>                   

                    </div>
                  </div>
              </div>
            </div>
          </div>
    
          <FooterComponent class="mt-auto bg-white shadow-md" />
        </div>
      </div>


  </template>
  
<style scoped>

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

    .detail-remarks.alt{
    background-color: #BBCDE5;
    }

    .detail-remarks .label {
    display: block;
    font-weight: bold;
    margin-bottom: 4px;
    }

    .detail-remarks .text {
    display: block;
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-wrap; 
    }

    .bg-primary {
    background-color: #1C5D99;
    }

    .grid {
    width: 100%;
    }

    .detail-item span {
    flex: 1;
    white-space: nowrap;
    }

    .detail-item strong {
    flex: 2;
    text-align: right;
    overflow-wrap: break-word;
    word-break: break-word;
    }

    .w-full.max-w-5xl {
    flex-grow: 1; 
    max-height: calc(100vh - 100px);
    overflow-y: auto;
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

    .status-pill {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 600;
        border-radius: 9999px;
        text-align: center;
        white-space: nowrap;
    }

  </style>
  