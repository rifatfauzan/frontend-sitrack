<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChassisStore } from '@/stores/chassis';
import { storeToRefs } from 'pinia';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();
const chassisStore = useChassisStore();
const { loading } = storeToRefs(chassisStore);
const chassisDetail = ref<any>(null);

const chassisId = route.query.id as string;

onMounted(async () => {
  if (chassisId) {
    chassisDetail.value = await chassisStore.getChassisById(chassisId);
  }
});

const goBack = () => {
  router.push('/chassis');
};

// Navigasi ke halaman edit
// const goToEdit = () => {
//   if (chassisId) {
//     router.push({ name: 'edit chassis', params: { id: chassisId } });
//   }
const goToEdit = () => {
  if (chassisDetail.value?.chassisId) {
    router.push({ name: 'edit chassis', query: { id: chassisDetail.value.chassisId } });
  }
};

const chassisTypeLabel = computed(() => {
  if (!chassisDetail.value?.chassisType) return '-';
  switch (chassisDetail.value.chassisType) {
    case 'F':
      return 'Flatbed';
    case 'T':
      return 'Trailer';
    default:
      return chassisDetail.value.chassisType;
  }
});

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
  return formattedDate;
};


//};

</script>

<template>
    <div class="flex h-screen overflow-auto">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Detail Chassis" />
  
        <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
          <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
          </div>
  
          <div v-else-if="chassisDetail" class="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">

                <VButton title="" class="bg-[#1C5D99] text-white px-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                    <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                </VButton>

                <h1 class="text-2xl font-bold">{{ chassisDetail.chassisId }}</h1>
              </div>
              <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="detail-item"><span>Year</span><strong>{{ chassisDetail.chassisYear || '-' }}</strong></div>
                <div class="detail-item alt"><span>KIR No.</span><strong>{{ chassisDetail.chassisKIRNo || '-' }}</strong></div>
                <div class="detail-item"><span>KIR Expiration</span><strong>{{ formatDate(chassisDetail.chassisKIRDate) || '-' }}</strong></div>
                <div class="detail-item alt"><span>Chassis No.</span><strong>{{ chassisDetail.chassisNumber || '-' }}</strong></div>
                <div class="detail-item"><span>Type</span><strong>{{ chassisTypeLabel }}</strong></div>
                <div class="detail-item alt"><span>Division</span><strong>{{ chassisDetail.division || '-' }}</strong></div>
                <div class="detail-item"><span>Department</span><strong>{{ chassisDetail.dept || '-' }}</strong></div>
              </div>
  
              <div class="space-y-3">
                <div class="detail-item"><span>Row Status</span><strong>{{ chassisDetail.rowStatus || '-' }}</strong></div>
                <div class="detail-item alt"><span>Axle</span><strong>{{ chassisDetail.chassisAxle || '-' }}</strong></div>
                <div class="detail-item"><span>Size</span><strong>{{ chassisDetail.chassisSize || '-' }}</strong></div>
                <div class="detail-item alt"><span>Site</span><strong>{{ chassisDetail.siteId || '-' }}</strong></div>
                <div class="detail-item"><span>Created by</span><strong>{{ chassisDetail.insertedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Created at</span><strong>{{ formatDate(chassisDetail.insertedDate) || '-' }}</strong></div>
                <div class="detail-item"><span>Updated by</span><strong>{{ chassisDetail.updatedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Updated at</span><strong>{{ formatDate(chassisDetail.updatedDate) || '-' }}</strong></div>
              </div>
            </div>
  
            <div class="detail-remarks">
                <span class="label">Remarks</span>
                <p class="text">{{ chassisDetail.chassisRemarks || '-' }}</p>
            </div>

          </div>
  
          <div v-else class="text-center text-red-500 font-semibold">
            Chassis tidak ditemukan.
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

  </style>
  