<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useOrderStore } from '@/stores/order';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { watch } from 'vue';

const orderStore = useOrderStore();
const customerStore = useCustomerStore();

const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

onMounted(() => {
  customerStore.fetchCustomers();
});

const form = reactive({
  customerId: '',
  orderDate: '',
  siteId: '',
  moveType: '',
  downPayment: 0,
  remarksOperasional: '',
  remarksSupervisor: '',
  tariffChassis20: 0,
  tariffChassis40: 0,

  qtyChassis20: 0,
  qtyChassis40: 0,

  qty120mtfl: 0,
  qty120mt: 0,
  qty220mtfl: 0,
  qty220mt: 0,
  qty140mtfl: 0,
  qty140mt: 0,
  qty120mt120fl: 0,
  qty120mt220fl: 0,
  qty220mt120fl: 0,
  qty220mt220fl: 0,
  qtyCh120fl: 0,
  qtyCh220fl: 0,
  qtyCh140fl: 0,
});

const getTariffForCustomer = (customerId: string, moveType: string, chassisSize: number): number | string => {
  const customer = customerStore.customers.find(c => c.id === customerId);
  if (!customer) return `Customer tidak ditemukan`;

  const tariff = customer.tariffs.find(
    t => t.moveType.toLowerCase() === moveType.toLowerCase() && t.chassisSize === chassisSize
  );

  if (!tariff) {
    return `Tariff untuk Chassis Size ${chassisSize} dengan Move Type ${moveType} belum didefinisikan untuk Customer ini.`;
  }

  return tariff.stdTariff;
};

const tariffDetails = ref<{ chassisSize: number; moveType: string; tariff: number; quantity: number; totalTariff: number; error?: string }[]>([]);
const calculateTariffDetails = () => {
  tariffDetails.value = [];

  if (!form.customerId || !form.moveType) return;

  if (form.qtyChassis20 > 0) {
    const tariff20 = getTariffForCustomer(form.customerId, form.moveType, 20);
    if (typeof tariff20 === 'string') {
      tariffDetails.value.push({
        chassisSize: 20,
        moveType: form.moveType,
        tariff: 0,
        quantity: form.qtyChassis20,
        totalTariff: 0,
        error: tariff20,
      });
    } else {
      const totalTariff20 = tariff20 * form.qtyChassis20;
      tariffDetails.value.push({
        chassisSize: 20,
        moveType: form.moveType,
        tariff: tariff20,
        quantity: form.qtyChassis20,
        totalTariff: totalTariff20,
      });
    }
  }

  if (form.qtyChassis40 > 0) {
    const tariff40 = getTariffForCustomer(form.customerId, form.moveType, 40);
    if (typeof tariff40 === 'string') {
      tariffDetails.value.push({
        chassisSize: 40,
        moveType: form.moveType,
        tariff: 0,
        quantity: form.qtyChassis40,
        totalTariff: 0,
        error: tariff40,
      });
    } else {
      const totalTariff40 = tariff40 * form.qtyChassis40;
      tariffDetails.value.push({
        chassisSize: 40,
        moveType: form.moveType,
        tariff: tariff40,
        quantity: form.qtyChassis40,
        totalTariff: totalTariff40,
      });
    }
  }
};

watch(
  [() => form.customerId, () => form.moveType, () => form.qtyChassis20, () => form.qtyChassis40],
  () => {
    calculateTariffDetails();
  },
  { immediate: true }
);

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

const goToList = () => router.push('/orders');
const goBack = () => router.push('/orders');
const confirmSubmit = () => (showConfirm.value = true);

const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  try {
    const response = await orderStore.addOrder({
      ...form,
    });

    if (response.success) {
      showSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Terjadi kesalahan!';
      showError.value = true;
    }
  } catch {
    errorMessage.value = 'Terjadi kesalahan saat menyimpan data.';
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="Buat Order" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
          <div class="header-container">
            <div class="header-content">
              <VButton title="Kembali" class="back-button" @click="goBack">
                <i class="pi pi-arrow-left"></i>
              </VButton>
              <h1 class="header-title">Buat Booking Order</h1>
            </div>
          </div>

          <form @submit.prevent="confirmSubmit">
            <div class="form-grid">
                <div class="form-group">
                <label for="customerId">Customer<span class="text-red-500">*</span></label>
                <select v-model="form.customerId" id="customerId" required>
                    <option value="" disabled>Pilih Customer</option>
                    <option
                    v-for="customer in customerStore.customers"
                    :key="customer.id"
                    :value="customer.id"
                    >
                    {{ customer.id }} - {{ customer.name }}
                    </option>

                </select>
                </div>

<!-- 
              <div class="form-group">
                <label for="siteId">Site ID</label>
                <input v-model="form.siteId" type="text" id="siteId" required />
              </div> -->

              <div class="form-group">
                <label for="orderDate">Order Date <span class="text-red-500">*</span></label>
                <input v-model="form.orderDate" type="date" id="orderDate" required />
              </div>

              <div class="form-group">
                <label for="moveType">Move Type<span class="text-red-500">*</span></label>
                <select v-model="form.moveType" id="moveType" required>
                  <option value="" disabled selected>Pilih Move Type</option>
                  <option value="Normal">Normal</option>
                  <option value="Repo">Repo</option>
                  <option value="Offhere">Offhere</option>
                  <option value="Kade">Kade</option>
                </select>
              </div>

              <div class="form-group">
                <label for="downPayment">Down Payment</label>
                <!-- <input v-model.number="form.downPayment" type="number" id="downPayment" /> -->
                <input class="placeholder-gray-400" v-model="form.downPayment" type="number" id="downPayment" min="0" step="0.01" placeholder="Rp0,00" required/>
              </div>

              <div class="form-group">
                <label for="qtyChassis20">20' Chassis Quantity<span class="text-red-500">*</span></label>
                <input v-model.number="form.qtyChassis20" type="number" id="qtyChassis20" min="0" required/>
            </div>

            <div class="form-group">
                <label for="qtyChassis40">40' Chassis Quantity<span class="text-red-500">*</span></label>
                <input v-model.number="form.qtyChassis40" type="number" id="qtyChassis40" min="0" required />
            </div>

              
            </div>
           <br>

            <h2 class="text-base font-bold mb-1">Container Data</h2>
            <div class="form-grid bg-[#BBCDE5] rounded-2xl p-4 shadow-sm">
            
            <div
                class="form-group"
                v-for="field in Object.keys(form).filter(f => f.startsWith('qty') && f !== 'qtyChassis20' && f !== 'qtyChassis40')"
                :key="field"
            >
                <label :for="field">{{ field }}</label>
                <input v-model.number="form[field]" type="number" :id="field" min="0" />
            </div>
            </div>


            <br>


            <div class="form-group full-width">
                <label for="remarksOperasional">Remarks</label>
                <textarea v-model="form.remarksOperasional" id="remarksOperasional" maxlength="300"></textarea>
            <!-- <input v-model="form.remarksOperasional" type="text" id="remarksOperasional" /> -->
            </div>

            <div class="mt-4">
              <h2 class="text-base font-semibold mb-2">Tariff Details</h2>
              <div class="overflow-x-auto bg-[#FAFAFF] rounded-lg shadow-sm">
                <table class="min-w-full text-sm text-left">
                  <thead class="bg-[#1C5D99] text-white text-center">
                    <tr>
                      <th class="px-4 py-3">Chassis Size</th>
                      <th class="px-4 py-3">Move Type</th>
                      <th class="px-4 py-3">Tariff</th>
                      <th class="px-4 py-3">Quantity</th>
                      <th class="px-4 py-3">Total Tariff</th>
                    </tr>
                  </thead>
                  <tbody class="text-center">
                    <tr v-for="tariff in tariffDetails" :key="tariff.chassisSize" class="border-t">
                      <td class="px-4 py-2">{{ tariff.chassisSize }}</td>
                      <td class="px-4 py-2">{{ tariff.moveType }}</td>
                      <td class="px-4 py-2" :class="{ 'text-red-500': tariff.error }">
                        {{ tariff.error || formatRupiah(tariff.tariff) }}
                      </td>
                      <td class="px-4 py-2">{{ tariff.quantity }}</td>
                      <td class="px-4 py-2 font-bold">{{ tariff.error ? '-' : formatRupiah(tariff.totalTariff) }}</td>
                    </tr>
                    <tr v-if="tariffDetails.length > 0" class="border-t">
                      <td colspan="4"></td>
                      <td class="px-4 py-2 font-bold text-[#1C5D99]">
                        {{ formatRupiah(tariffDetails.reduce((sum, tariff) => sum + (tariff.totalTariff || 0), 0)) }}
                      </td>
                    </tr>
                    <tr v-if="tariffDetails.length === 0">
                      <td colspan="5" class="px-4 py-2 text-gray-500">Tidak ada Tariff yang dapat ditampilkan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-10"></div>
            <VButton type="submit" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full mt-4" :disabled="loading">
              {{ loading ? "Menyimpan..." : "Simpan Order" }}
            </VButton>
          </form>
        </div>
      </div>

      <ConfirmationDialog
        :visible="showConfirm"
        @close="showConfirm = false"
        @confirm="submitForm"
        :message="'Apakah data order sudah sesuai?'"
      />

      <SuccessDialog
        :visible="showSuccess"
        @close="goToList"
        :message="'Order baru berhasil terdaftar!'"
        redirectTo="/orders"
        buttonText="Kembali ke List Order"
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

.error-text {
  color: #EB5757;
  font-size: 0.8rem;
  margin-top: 5px;
}
</style>
