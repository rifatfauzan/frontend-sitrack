<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import FooterComponent from '@/components/vFooter.vue';
import HeaderComponent from '@/components/vHeader.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Bar, Pie } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale);

const currentYear = new Date().getFullYear();
const selectedYearOrders = ref(currentYear);
const selectedYearTransactions = ref(currentYear);
const monthlyOrders = ref<number[]>(Array(12).fill(0));
const customerStats = ref<{ name: string; value: number }[]>([]);
const authStore = useAuthStore();

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isAuthorized = computed(() => ['Admin', 'Manager'].includes(authStore.role));

const fetchOrderStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/order/chart?year=${selectedYearOrders.value}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    const data = await response.json();
    monthlyOrders.value = data.data.map((item: { orderCount: number }) => item.orderCount);
  } catch (err) {
    console.error('Gagal fetch statistik order:', err);
  }
};

const fetchCustomerStats = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customer/stats/${selectedYearTransactions.value}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });
    const data = await response.json();
    customerStats.value = data.data;
  } catch (err) {
    console.error('Gagal fetch statistik customer:', err);
  }
};

const selectedYearDest = ref(currentYear);
const destinationStats = ref<{ name: string; value: number }[]>([]);

const fetchDestinationStats = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/order/destination?year=${selectedYearDest.value}`,
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    );
    const json = await res.json();
    destinationStats.value = json.data;
  } catch (e) {
    console.error('Gagal fetch destination stats', e);
  }
};

const referenceData = ref<{ trucks: number; chassis: number; drivers: number; customers: number } | null>(null);

const fetchReferenceData = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/referencestat`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const json = await res.json();
    referenceData.value = json.data;
  } catch (e) {
    console.error('Gagal fetch reference data', e);
  }
};

const customerViewType = ref<'top' | 'bottom'>('top');
const destinationViewType = ref<'top' | 'bottom'>('top');

const toggleDestinationView = () => {
  destinationViewType.value = destinationViewType.value === 'top' ? 'bottom' : 'top';
}

const toggleCustomerView = () => {
  customerViewType.value = customerViewType.value === 'top' ? 'bottom' : 'top'
}

const customerViewTypeLabel = computed(() =>
  customerViewType.value === 'top' ? 'Top 5' : 'Bottom 5'
)

const sortedCustomerStats = computed(() => {
  const sorted = customerStats.value.slice().sort((a, b) => b.value - a.value);
  if (customerViewType.value === 'top') {
    return sorted.slice(0, 5);
  } else {
    return sorted.slice(-5).reverse();
  }
});

const sotredDestinationStats = computed(() => {
  const sorted = destinationStats.value.slice().sort((a, b) => b.value - a.value);
  if (destinationViewType.value === 'top') {
    return sorted.slice(0, 5);
  } else {
    return sorted.slice(-5).reverse();
  }
});

const chartColors = ['#1C5D99', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const glassColors = [
  'rgba(28, 93, 153, 0.4)',
  'rgba(239, 68, 68, 0.4)',
  'rgba(16, 185, 129, 0.4)',
  'rgba(245, 158, 11, 0.4)',
  'rgba(99, 102, 241, 0.4)',
  'rgba(236, 72, 153, 0.4)',
];


onMounted(() => {
  if (isAuthorized.value) {
    fetchOrderStats();
    fetchCustomerStats();
    fetchDestinationStats();
    fetchReferenceData();
  }
});

watch(selectedYearOrders, fetchOrderStats);
watch(selectedYearTransactions, fetchCustomerStats);
watch(selectedYearDest, fetchDestinationStats);
</script>

<template>
  <div class="flex min-h-screen overflow-x-hidden">
    <div class="fixed top-0 bottom-0 left-0 w-64 z-20">
      <Sidebar />
    </div>

    <div class="ml-64 flex-1 flex flex-col min-h-screen">
      <div class="fixed top-0 left-64 right-0 h-16 z-10 bg-gray-200">
        <HeaderComponent title="Beranda" />
      </div>

      <main class="mt-16 flex-1 bg-[#BBCDE5] px-6 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          <div class="col-span-2 bg-[#E5ECF6] rounded-lg p-6 flex flex-col items-center">
            <img src="@/assets/SiTrack.png" alt="SiTrack Logo" class="h-72" />
            <h1 class="text-3xl font-bold text-[#1C5D99]">Sistem Informasi Tracking</h1>
            <h2 class="text-xl font-medium text-[#1C5D99]">PT. Glorious Interbuana</h2>
          </div>

          <!-- Reference Data -->
          <div v-if="isAuthorized" class="bg-white rounded-lg shadow p-6 reference-box">
            <h3 class="font-semibold text-base mb-4">Current Reference Data</h3>
              <div class="grid grid-cols-4 gap-4 h-full items-stretch">
                <!-- Trucks -->
                <div class="rounded-lg w-full h-full min-h-[160px] flex flex-col justify-center items-center font-bold text-lg text-white" style="background-color: #1C5D99;">
                  <span class="text-sm">Trucks</span>
                  <span class="text-4xl mt-1">{{ referenceData?.trucks }}</span>
                </div>

                <!-- Chassis -->
                <div class="rounded-lg w-full h-full min-h-[160px] flex flex-col justify-center items-center font-bold text-lg text-white" style="background-color: #469C9F;">
                  <span class="text-sm">Chassis</span>
                  <span class="text-4xl mt-1">{{ referenceData?.chassis }}</span>
                </div>

                <!-- Drivers -->
                <div class="rounded-lg w-full h-full min-h-[160px] flex flex-col justify-center items-center font-bold text-lg text-black" style="background-color: #A9BEDC;">
                  <span class="text-sm">Drivers</span>
                  <span class="text-4xl mt-1">{{ referenceData?.drivers }}</span>
                </div>

                <!-- Customers -->
                <div class="rounded-lg w-full h-full min-h-[160px] flex flex-col justify-center items-center font-bold text-lg text-white" style="background-color: #66A9BF;">
                  <span class="text-sm">Customers</span>
                  <span class="text-4xl mt-1">{{ referenceData?.customers }}</span>
                </div>
              </div>
          </div>

          <!-- Customer Transactions Pie Chart -->
          <div v-if="isAuthorized" class="bg-white rounded-lg shadow p-6 min-h-[300px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-base">Customer Transactions</h3>
              <select v-model="selectedYearTransactions" class="border rounded px-2 py-1 text-xs">
                <option :value="currentYear - 2">{{ currentYear - 2 }}</option>
                <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
                <option :value="currentYear">{{ currentYear }}</option>
              </select>
            </div>
            <div v-if="customerStats.length" class="flex justify-center items-center gap-4">
              <div class="w-[45%] h-64">
                <Pie
                  :data="{
                    labels: customerStats.map(cs => cs.name),
                    datasets: [
                      {
                        data: customerStats.map(cs => cs.value),
                        backgroundColor: glassColors,
                        borderColor: 'rgba(0, 0, 0, 0.15)',
                        borderWidth: 3
                      }
                    ]
                  }"
                  :options="{
                    responsive: true,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: ctx => `Jumlah Transaksi: ${ctx.raw}`
                        }
                      },
                      legend: {
                        display: false
                      }
                    }
                  }"
                />

              </div>

              
              <div class="text-xs w-[45%]">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-1">
                    <h4 class="font-semibold">{{ customerViewTypeLabel }} Customers</h4>
                    <button @click="toggleCustomerView" class="rounded hover:bg-gray-100" title="Toggle sort">
                      <svg v-if="customerViewType === 'top'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 01.894.553l5 10A1 1 0 0115 15H5a1 1 0 01-.894-1.447l5-10A1 1 0 0110 3zm0 2.618L6.618 13h6.764L10 5.618z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 17a1 1 0 01-.894-.553l-5-10A1 1 0 015 5h10a1 1 0 01.894 1.447l-5 10A1 1 0 0110 17zm0-2.618L13.382 7H6.618L10 14.382z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <ol class="space-y-1">
                  <li
                    v-for="(item, index) in sortedCustomerStats"
                    :key="index"
                    class="flex justify-between items-center"
                  >
                    <div class="flex items-center">
                      <span
                        class="inline-block w-3 h-3 rounded-full mr-2"
                        :style="{ backgroundColor: glassColors[index % glassColors.length] }"
                      ></span>
                      {{ index + 1 }}. {{ item.name }}
                    </div>
                    <span class="font-medium">{{ item.value }}</span>
                  </li>
                </ol>
              </div>

            </div>
            <div v-else class="flex-grow flex items-center justify-center">
              <p class="text-center text-gray-500 text-sm">
                Tidak ada data transaksi customer pada tahun {{ selectedYearTransactions }}
              </p>
            </div>
          </div>

          <!-- Destination Distribution Pie Chart -->
          <div v-if="isAuthorized" class="bg-white rounded-lg shadow p-6 min-h-[300px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-base">Destination Distribution</h3>
              <select v-model="selectedYearDest" class="border rounded px-2 py-1 text-xs">
                <option :value="currentYear - 2">{{ currentYear - 2 }}</option>
                <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
                <option :value="currentYear">{{ currentYear }}</option>
              </select>
            </div>
            <div v-if="destinationStats.length" class="flex justify-center items-center gap-4">
              <div class="w-[45%] h-64">
                <Pie
                  :data="{
                    labels: destinationStats.map(ds => ds.name),
                    datasets: [
                      {
                        data: destinationStats.map(ds => ds.value),
                        backgroundColor: glassColors,
                        borderColor: 'rgba(0, 0, 0, 0.15)',
                        borderWidth: 3
                      }
                    ]
                  }"
                  :options="{
                    responsive: true,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: ctx => `${ctx.label}: ${ctx.raw}`
                        }
                      },
                      legend: {
                        display: false
                      }
                    }
                  }"
                />
              </div>
              <div class="text-xs w-[45%]">
                <div class="'flex items-center justify-between mb-2">
                  <div class="flex items-center gap-1">
                    <h4 class="font-semibold">{{ destinationViewType === 'top' ? 'Top 5' : 'Bottom 5' }} Destinations</h4>
                    <button @click="toggleDestinationView" class="rounded hover:bg-gray-100" title="Toggle sort">
                      <svg v-if="destinationViewType === 'top'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 01.894.553l5 10A1 1 0 0115 15H5a1 1 0 01-.894-1.447l5-10A1 1 0 0110 3zm0 2.618L6.618 13h6.764L10 5.618z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 17a1 1 0 01-.894-.553l-5-10A1 1 0 015 5h10a1 1 0 01.894 1.447l-5 10A1 1 0 0110 17zm0-2.618L13.382 7H6.618L10 14.382z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <ol class="space-y-2">
                  <li v-for="(item, index) in sotredDestinationStats" :key="index" class="flex items-center">
                    <span class="inline-block w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: glassColors[index % glassColors.length] }"></span>
                    {{ index + 1 }}. {{ item.name }}
                  </li>
                </ol>
              </div>
            </div>
            <div v-else class="flex-grow flex items-center justify-center">
              <p class="text-center text-gray-500 text-sm">
                Tidak ada data destinasi pada tahun {{ selectedYearDest }}
              </p>
            </div>         
          </div>


          <!-- Order Chart -->
          <div v-if="isAuthorized" class="bg-white rounded-lg shadow p-6 min-h-[300px]">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-semibold text-base">Order Chart</h3>
              <select v-model="selectedYearOrders" class="border rounded px-2 py-1 text-xs">
                <option :value="currentYear - 2">{{ currentYear - 2 }}</option>
                <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
                <option :value="currentYear">{{ currentYear }}</option>
              </select>
            </div>
            <div class="w-full h-60">
              <Bar :data="{ labels: monthLabels, datasets: [ { label: 'Jumlah Order', backgroundColor: '#1C5D99', data: monthlyOrders } ] }" :options="{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `Jumlah Order: ${ctx.raw}` } } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }" />
            </div>
          </div>
        </div>
      </main>

      <div class="fixed bottom-0 left-64 right-0 h-16 bg-gray-200 z-10">
        <FooterComponent />
      </div>
    </div>
  </div>
</template>
a
<style scoped>
body {
  margin: 0;
}

.reference-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
}

</style>
