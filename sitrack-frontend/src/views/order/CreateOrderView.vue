<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
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
import ContainerLoadsTable from '@/components/ContainerLoadsTable.vue';

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
  qty120mt140fl: 0,
  qty120mt220fl: 0,
  qty220mt120fl: 0,
  qty220mt220fl: 0,
  qtyCh120fl: 0,
  qtyCh220fl: 0,
  qtyCh140fl: 0,

  qty145mt: 0,
  qty145fl: 0,
  qty145mtfl: 0,
});


type LoadRow = { code:string; qty:number };
const loads = ref<LoadRow[]>([]);

const needed = computed(() => {
  return loads.value.reduce(
    (acc, r) => {
      if (!r.code || r.qty <= 0) return acc;
      const ch = loadCatalog[r.code]?.chassis;
      if (ch === 20) acc.ch20 += r.qty;
      if (ch === 40) acc.ch40 += r.qty;
      return acc;
    },
    { ch20: 0, ch40: 0 }
  );
});

type TariffRow = {
  containerType: string;
  chassisSize: 20 | 40;
  moveType: string;
  quantity: number;
  tariff?: number;
  totalTariff?: number;
  error?: string;
};
const tariffDetails = ref<TariffRow[]>([]);

const loadCatalog: Record<
  string,
  { field: string; chassis: 20 | 40; containerType: string }
> = {
  // ---- 20'
  '120MTFL':    { field: 'qty120mtfl',    chassis: 20, containerType: '120MTFL' },
  '120MT':      { field: 'qty120mt',      chassis: 20, containerType: '120MT'   },
  'CH120FL':    { field: 'qtyCh120fl',    chassis: 20, containerType: 'CH120FL' },
  // ---- 40'
  '220MTFL':    { field: 'qty220mtfl',    chassis: 40, containerType: '220MTFL' },
  '220MT':      { field: 'qty220mt',      chassis: 40, containerType: '220MT'   },
  '140MTFL':    { field: 'qty140mtfl',    chassis: 40, containerType: '140MTFL' },
  '140MT':      { field: 'qty140mt',      chassis: 40, containerType: '140MT'   },
  '120MT120FL': { field: 'qty120mt120fl', chassis: 40, containerType: '120MT120FL' },
  '120MT220FL': { field: 'qty120mt220fl', chassis: 40, containerType: '120MT220FL' },
  '220MT120FL': { field: 'qty220mt120fl', chassis: 40, containerType: '220MT120FL' },
  '220MT220FL': { field: 'qty220mt220fl', chassis: 40, containerType: '220MT220FL' },
  '120MT140FL': { field: 'qty120mt140fl', chassis: 40, containerType: '120MT140FL' },
  'CH140FL':    { field: 'qtyCh140fl',    chassis: 40, containerType: 'CH140FL' },
  'CH220FL':    { field: 'qtyCh220fl',    chassis: 40, containerType: 'CH220FL' },
  '145MT':      { field: 'qty145mt',      chassis: 40, containerType: '145MT'   },
  '145FL':      { field: 'qty145fl',      chassis: 40, containerType: '145FL'   },
  '145MTFL':    { field: 'qty145mtfl',    chassis: 40, containerType: '145MTFL' },
};

function loadsToFields() {
  Object.values(loadCatalog).forEach(({ field }) => (form as any)[field] = 0);

  loads.value.forEach(l => {
    if (!l.code || l.qty <= 0) return;
    const field = loadCatalog[l.code].field;
    (form as any)[field] = l.qty;
  });
}


const getTariffForCustomer = (customerId: string, moveType: string, chassisSize: number, containerType: string): number | string => {
  const customer = customerStore.customers.find(c => c.id === customerId);
  if (!customer) return `Customer tidak ditemukan`;

  const tariff = customer.tariffs.find(
    t => t.moveType.toLowerCase() === moveType.toLowerCase() && t.chassisSize === chassisSize && t.containerType === containerType
  );

  if (!tariff) {
    return `Tariff untuk Chassis Size ${chassisSize} dan Container Type ${containerType} dengan Move Type ${moveType} belum didefinisikan untuk Customer ini.`;
  }

  return tariff.stdTariff;
};

const calculateTariffDetails = () => {
  tariffDetails.value = [];
  if (!form.customerId || !form.moveType) return;

  const hasLoadCh20 = loads.value.some(
    r => loadCatalog[r.code]?.chassis === 20 && r.qty > 0
  );
  const hasLoadCh40 = loads.value.some(
    r => loadCatalog[r.code]?.chassis === 40 && r.qty > 0
  );

  if (form.qtyChassis20 > 0 && !hasLoadCh20) {
    const tariff20 = getTariffForCustomer(
      form.customerId,
      form.moveType,
      20,
      '-'  
    );
    tariffDetails.value.push({
      containerType: '-',
      chassisSize:   20,
      moveType:      form.moveType,
      quantity:      form.qtyChassis20,
      tariff:        typeof tariff20 === 'string' ? 0 : tariff20,
      totalTariff:   typeof tariff20 === 'string' ? 0 : tariff20 * form.qtyChassis20,
      error:         typeof tariff20 === 'string' ? tariff20 : undefined,
    });
  }

  if (form.qtyChassis40 > 0 && !hasLoadCh40) {
    const tariff40 = getTariffForCustomer(
      form.customerId,
      form.moveType,
      40,
      '-'
    );
    tariffDetails.value.push({
      containerType: '-',
      chassisSize:   40,
      moveType:      form.moveType,
      quantity:      form.qtyChassis40,
      tariff:        typeof tariff40 === 'string' ? 0 : tariff40,
      totalTariff:   typeof tariff40 === 'string' ? 0 : tariff40 * form.qtyChassis40,
      error:         typeof tariff40 === 'string' ? tariff40 : undefined,
    });
  }

  loads.value
    .filter(r => r.code && r.qty > 0)
    .forEach(r => {
      const meta = loadCatalog[r.code];
      if (!meta) return;

      const res = getTariffForCustomer(
        form.customerId,
        form.moveType,
        meta.chassis,
        meta.containerType
      );

      tariffDetails.value.push({
        containerType: meta.containerType,
        chassisSize:   meta.chassis,
        moveType:      form.moveType,
        quantity:      r.qty,
        tariff:        typeof res === 'string' ? 0 : res,
        totalTariff:   typeof res === 'string' ? 0 : res * r.qty,
        error:         typeof res === 'string' ? res : undefined,
      });
    });
};



watch(
  [() => form.customerId, () => form.moveType, () => form.qtyChassis20, () => form.qtyChassis40],
  () => {
    calculateTariffDetails();
  },
  { immediate: true }
);


watch(needed, n => {
  form.qtyChassis20 = n.ch20;
  form.qtyChassis40 = n.ch40;
});


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

  loadsToFields();

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
    
            </div>

            <br>

            <h2 class="text-base font-bold mb-1">Container Data</h2>
            <ContainerLoadsTable v-model="loads" class="bg-[#F5F7FA] p-4 rounded-lg shadow-sm" />

            <div class="flex gap-4 mt-6">
            <div class="flex-1">
              <div class="bg-[#1C5D99] text-white text-center py-2 rounded-t-lg">
                <b>Total 20' Chassis Quantity</b>
              </div>
              <input
                class="w-full border border-gray-300 rounded-b-lg py-2 text-center"
                :value="form.qtyChassis20"
                readonly
              />
            </div>

            <div class="flex-1">
              <div class="bg-[#1C5D99] text-white text-center py-2 rounded-t-lg">
                <b>Total 40' Chassis Quantity</b>
              </div>
              <input
                class="w-full border border-gray-300 rounded-b-lg py-2 text-center"
                :value="form.qtyChassis40"
                readonly
              />
            </div>
          </div>

            <div class="mt-4">
              <h2 class="text-base font-semibold mb-2">Tariff Details</h2>
              <div class="overflow-x-auto bg-[#FAFAFF] rounded-lg shadow-sm">
                <table class="min-w-full text-sm text-left">
                  <thead class="bg-[#1C5D99] text-white text-center">
                    <tr>
                      <th class="px-4 py-3">Chassis Size</th>
                      <th class="px-4 py-3">Move Type</th>
                      <th class="px-4 py-3">Container Type</th>
                      <th class="px-4 py-3">Tariff</th>
                      <th class="px-4 py-3">Quantity</th>
                      <th class="px-4 py-3">Total Tariff</th>
                    </tr>
                  </thead>
                  <tbody class="text-center">
                    <tr v-for="tariff in tariffDetails" :key="tariff.chassisSize" class="border-t">
                      <td class="px-4 py-2">{{ tariff.chassisSize }}</td>
                      <td class="px-4 py-2">{{ tariff.moveType }}</td>
                      <td class="px-4 py-2">{{ tariff.containerType }}</td>
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

            <div class="form-group full-width">
                <label for="remarksOperasional">Remarks</label>
                <textarea v-model="form.remarksOperasional" id="remarksOperasional" maxlength="300"></textarea>
            <!-- <input v-model="form.remarksOperasional" type="text" id="remarksOperasional" /> -->
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
