<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import FooterComponent from '@/components/vFooter.vue';
import HeaderComponent from '@/components/vHeader.vue';
import { ref, onMounted, watch } from 'vue';
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

onMounted(() => {
  fetchOrderStats();
  fetchCustomerStats();
});

watch(selectedYearOrders, fetchOrderStats);
watch(selectedYearTransactions, fetchCustomerStats);
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
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
          <div class="col-span-2 bg-[#E5ECF6] rounded-lg p-4 flex flex-col items-center">
            <img src="@/assets/SiTrack.png" alt="SiTrack Logo" class="h-36" />
            <h1 class="text-xl font-bold text-[#1C5D99]">Sistem Informasi Tracking</h1>
            <h2 class="text-lg font-medium text-[#1C5D99]">PT. Glorious Interbuana</h2>
          </div>

          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold text-base mb-2">Reference Data</h3>
            <div class="w-full h-32 flex items-center justify-center text-gray-400 text-xs">[ isi sini der ]</div>
          </div>

          <!-- Customer Transactions Pie Chart -->
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-base">Customer Transactions</h3>
              <select v-model="selectedYearTransactions" class="border rounded px-2 py-1 text-xs">
                <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
                <option :value="currentYear">{{ currentYear }}</option>
              </select>
            </div>
            <div class="w-full h-48">
              <Pie :data="{
                labels: customerStats.map(cs => cs.name),
                datasets: [
                  {
                    data: customerStats.map(cs => cs.value),
                    backgroundColor: ['#1C5D99', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899']
                  }
                ]
              }" :options="{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: ctx => `${ctx.label}: ${ctx.raw}`
                    }
                  },
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 10,
                      font: { size: 10 }
                    }
                  }
                }
              }" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold text-base mb-2">Destination Distribution</h3>
            <div class="w-full h-32 flex items-center justify-center text-gray-400 text-xs">[ ini juga ye ]</div>
          </div>

          <!-- Order Chart -->
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-base">Order Chart</h3>
              <select v-model="selectedYearOrders" class="border rounded px-2 py-1 text-xs">
                <option :value="currentYear - 1">{{ currentYear - 1 }}</option>
                <option :value="currentYear">{{ currentYear }}</option>
              </select>
            </div>
            <div class="w-full h-48">
              <Bar :data="{
                labels: monthLabels,
                datasets: [
                  {
                    label: 'Jumlah Order',
                    backgroundColor: '#1C5D99',
                    data: monthlyOrders
                  }
                ]
              }" :options="{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: ctx => `Jumlah Order: ${ctx.raw}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }" />
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

<style scoped>
body {
  margin: 0;
}
</style>
