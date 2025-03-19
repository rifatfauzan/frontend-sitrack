<template>
    <div class="flex h-screen overflow-auto">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Detail Customer" />
  
        <div class="flex-1 p-6 main-content overflow-y-auto flex justify-center">
          <div v-if="loading" class="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
            <Skeleton width="100%" height="2rem" class="mb-4" />
          </div>
  
          <div v-else-if="customer" class="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md overflow-y-auto">
            <div class="flex items-center justify-between bg-primary text-white px-6 py-4 rounded-lg mb-6">
              <div class="flex items-center space-x-4">
                <VButton title="Back" class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="goBack">
                    <i class="pi pi-arrow-left"></i>
                </VButton>
                <div>
                  <h1 class="text-2xl font-bold">{{ customer.name }}</h1>
                  <p class="text-sm">{{ customer.id }}</p>
                </div>
              </div>
              <VButton title="Edit" class="bg-[#639FAB] text-black px-4 py-2 rounded shadow-md" @click="goToEdit" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="detail-item"><span>Customer ID</span><strong>{{ customer.id || '-' }}</strong></div>
                <div class="detail-item alt"><span>Site ID</span><strong>{{ customer.siteId || '-' }}</strong></div>
                <div class="detail-item"><span>Address</span><strong>{{ customer.address || '-' }}</strong></div>
                <div class="detail-item alt"><span>Contract No.</span><strong>{{ customer.contractNo || '-' }}</strong></div>
                <div class="detail-item"><span>City Origin</span><strong>{{ customer.cityOrigin || '-' }}</strong></div>
                <div class="detail-item alt"><span>City Destination</span><strong>{{ customer.cityDestination || '-' }}</strong></div>
                <div class="detail-item"><span>Commodity</span><strong>{{ customer.commodity || '-' }}</strong></div>
                <div class="detail-item alt"><span>Move Type</span><strong>{{ customer.moveType || '-' }}</strong></div>
              </div>
              
              <div class="space-y-3">
                <div class="detail-item"><span>Created By</span><strong>{{ customer.insertedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Created Date</span><strong>{{ formatDate(customer.insertedDate) || '-' }}</strong></div>
                <div class="detail-item"><span>Updated By</span><strong>{{ customer.updatedBy || '-' }}</strong></div>
                <div class="detail-item alt"><span>Updated Date</span><strong>{{ formatDate(customer.updatedDate) || '-' }}</strong></div>
              </div>
            </div>

            <h2 class="text-xl font-bold text-[#1C5D99] mt-6 mb-4">Tariffs</h2>
            <div class="overflow-x-auto max-h-[50vh] overflow-y-auto">
              <table v-if="customer.tariffs.length > 0" class="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr class="bg-gray-200 text-left">
                    <th class="p-3 border">Type</th>
                    <th class="p-3 border">Std Tariff</th>
                    <th class="p-3 border">Insurance</th>
                    <th class="p-3 border">Tips</th>
                    <th class="p-3 border">Police</th>
                    <th class="p-3 border">LOLO</th>
                    <th class="p-3 border">Others</th>
                    <th class="p-3 border">Total Tariff</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tariff in customer.tariffs" :key="tariff.tariffId" class="text-center">
                    <td class="p-3 border text-left">{{ tariff.type }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.stdTariff) }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.insurance) }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.tips) }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.police) }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.lolo) }}</td>
                    <td class="p-3 border text-left">{{ formatRupiah(tariff.others) }}</td>
                    <td class="p-3 border text-left font-bold">{{ formatRupiah(tariff.totalTariff) }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="text-gray-500">Tidak ada tarif yang tersedia.</p>
            </div>

          </div>
  
          <div v-else class="text-center text-red-500 font-semibold">
            Customer tidak ditemukan.
          </div>
        </div>
  
        <FooterComponent class="mt-auto bg-white shadow-md" />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import Skeleton from 'primevue/skeleton';

const route = useRoute();
const router = useRouter();
const customerStore = useCustomerStore();
const customer = ref<any>(null);
const loading = ref(true);

const customerFields = {
    id: "Customer ID",
    siteId: "Site ID",
    name: "Nama Customer",
    address: "Alamat",
    contractNo: "Nomor Kontrak",
    cityOrigin: "Kota Asal",
    cityDestination: "Kota Tujuan",
    commodity: "Komoditas",
    moveType: "Tipe Perpindahan",
    insertedBy: "Inserted By",
    insertedDate: "Inserted Date",
    updatedBy: "Updated By",
    updatedDate: "Updated Date",
};

onMounted(async () => {
    const customerId = route.query.id as string;
    if (customerId) {
        customer.value = await customerStore.getCustomerById(customerId);
    }
    loading.value = false;
});

const goBack = () => {
  router.push('/customers');
};

const goToEdit = () => {
  if (customer.value?.id) {
    router.push({ name: 'edit customers', query: { id: customer.value.id } });
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString('id-ID', options);
  return formattedDate;
};

const formatRupiah = (angka) => {
  if (!angka) return "Rp0,00";
  let rupiah = angka.toString().replace(/[^,\d]/g, "");
  let split = rupiah.split(",");
  let sisa = split[0].length % 3;
  let rupiahFormatted = split[0].substr(0, sisa);
  let ribuan = split[0].substr(sisa).match(/\d{3}/g);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiahFormatted += separator + ribuan.join(".");
  }

  rupiahFormatted = split[1] ? rupiahFormatted + "," + split[1] : rupiahFormatted;
  return "Rp" + rupiahFormatted;
};
</script>

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

  .bg-primary {
    background-color: #1C5D99;
  }

  .tariff-table th, .tariff-table td {
    padding: 12px;
    border: 1px solid #ddd;
  }

  .overflow-x-auto {
    max-height: 50vh;
    overflow-y: auto;
  }
</style>
