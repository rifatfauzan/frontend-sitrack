<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useOrderStore } from '@/stores/order';
import { useCustomerStore } from '@/stores/customer';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import ContainerLoadsTable from '@/components/ContainerLoadsTable.vue';

const orderStore = useOrderStore();
const customerStore = useCustomerStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref('');

const form = reactive({
  orderId: '',
  customerId: '',
  orderDate: '',
  siteId: '',
  moveType: '',
  downPayment: 0,
  remarksOperasional: '',
  remarksSupervisor: '',

  qtyChassis20: 0,
  qtyChassis40: 0,

  qty120mtfl: 0,  qty120mt: 0,  qty220mtfl: 0,  qty220mt: 0,
  qty140mtfl: 0,  qty140mt: 0,
  qty120mt120fl: 0, qty120mt140fl: 0, qty120mt220fl: 0,
  qty220mt120fl: 0, qty220mt220fl: 0,
  qtyCh120fl: 0,  qtyCh220fl: 0,  qtyCh140fl: 0,
  qty145mt: 0,   qty145fl: 0,   qty145mtfl: 0,
});

type LoadRow = { code: string; qty: number };
const loads = ref<LoadRow[]>([]);

const loadCatalog: Record<
  string,
  { chassis: 20 | 40; field: string; containerType: string }
> = {
  '120MTFL': { chassis: 20, field: 'qty120mtfl',  containerType: '120MTFL' },
  '120MT'  : { chassis: 20, field: 'qty120mt',    containerType: '120MT'   },
  'CH120FL': { chassis: 20, field: 'qtyCh120fl',  containerType: 'CH120FL' },
  
  '220MTFL':     { chassis: 40, field: 'qty220mtfl',     containerType: '220MTFL' },
  '220MT':       { chassis: 40, field: 'qty220mt',       containerType: '220MT'   },
  '140MTFL':     { chassis: 40, field: 'qty140mtfl',     containerType: '140MTFL' },
  '140MT':       { chassis: 40, field: 'qty140mt',       containerType: '140MT'   },
  '120MT120FL':  { chassis: 40, field: 'qty120mt120fl',  containerType: '120MT120FL' },
  '120MT220FL':  { chassis: 40, field: 'qty120mt220fl',  containerType: '120MT220FL' },
  '120MT140FL':  { chassis: 40, field: 'qty120mt140fl',  containerType: '120MT140FL' },
  '220MT120FL':  { chassis: 40, field: 'qty220mt120fl',  containerType: '220MT120FL' },
  '220MT220FL':  { chassis: 40, field: 'qty220mt220fl',  containerType: '220MT220FL' },
  'CH140FL':     { chassis: 40, field: 'qtyCh140fl',     containerType: 'CH140FL'   },
  'CH220FL':     { chassis: 40, field: 'qtyCh220fl',     containerType: 'CH220FL'   },
  '145MT':       { chassis: 40, field: 'qty145mt',       containerType: '145MT'     },
  '145FL':       { chassis: 40, field: 'qty145fl',       containerType: '145FL'     },
  '145MTFL':     { chassis: 40, field: 'qty145mtfl',     containerType: '145MTFL'   },
};

function fieldsToLoads() {
  loads.value = [];
  Object.entries(loadCatalog).forEach(([code, { field }]) => {
    const q = (form as any)[field] || 0;
    if (q > 0) loads.value.push({ code, qty: q });
  });
}
function loadsToFields() {
  Object.values(loadCatalog).forEach(({ field }) => ((form as any)[field] = 0));
  loads.value.forEach(l => {
    if (l.qty > 0) (form as any)[loadCatalog[l.code].field] = l.qty;
  });
}


onMounted(async () => {
  const id = route.query.id as string;
  if (!id) {
    toast.error('Order ID tidak ditemukan');
    router.push('/orders');
    return;
  }
  loading.value = true;
  try {
    await customerStore.fetchCustomers();
    const data = await orderStore.getOrderById(id);
    if (!data) throw new Error();
    Object.assign(form, data);
    fieldsToLoads();
    calculateTariffDetails();
  } catch {
    toast.error('Gagal memuat data order');
    router.push('/orders');
  } finally {
    loading.value = false;
  }
});


const needed = computed(() =>
  loads.value.reduce(
    (a, l) => {
      const meta = loadCatalog[l.code as keyof typeof loadCatalog];
      if (!meta || l.qty <= 0) return a;

      meta.chassis === 20 ? (a.ch20 += l.qty) : (a.ch40 += l.qty);
      return a;
    },
    { ch20: 0, ch40: 0 }
  )
);


watch(needed, n => {
  form.qtyChassis20 = n.ch20;
  form.qtyChassis40 = n.ch40;
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

  const has20 = loads.value.some(l => {
    const meta = loadCatalog[l.code as keyof typeof loadCatalog];
    return meta && meta.chassis === 20 && l.qty > 0;
  });
  const has40 = loads.value.some(l => {
    const meta = loadCatalog[l.code as keyof typeof loadCatalog];
    return meta && meta.chassis === 40 && l.qty > 0;
  });

  if (form.qtyChassis20 > 0 && !has20) {
    const t = getTariffForCustomer(form.customerId, form.moveType, 20, '-');
    tariffDetails.value.push({
      containerType: '-',
      chassisSize: 20,
      moveType: form.moveType,
      quantity: form.qtyChassis20,
      tariff: typeof t === 'string' ? 0 : t,
      totalTariff: typeof t === 'string' ? 0 : t * form.qtyChassis20,
      error: typeof t === 'string' ? t : undefined,
    });
  }
  if (form.qtyChassis40 > 0 && !has40) {
    const t = getTariffForCustomer(form.customerId, form.moveType, 40, '-');
    tariffDetails.value.push({
      containerType: '-',
      chassisSize: 40,
      moveType: form.moveType,
      quantity: form.qtyChassis40,
      tariff: typeof t === 'string' ? 0 : t,
      totalTariff: typeof t === 'string' ? 0 : t * form.qtyChassis40,
      error: typeof t === 'string' ? t : undefined,
    });
  }

  loads.value.forEach(l => {
    if (l.qty <= 0) return;
    const meta = loadCatalog[l.code as keyof typeof loadCatalog];
    if (!meta) return;
    const t = getTariffForCustomer(form.customerId, form.moveType, meta.chassis, meta.containerType);
    tariffDetails.value.push({
      containerType: meta.containerType,
      chassisSize: meta.chassis,
      moveType: form.moveType,
      quantity: l.qty,
      tariff: typeof t === 'string' ? 0 : t,
      totalTariff: typeof t === 'string' ? 0 : t * l.qty,
      error: typeof t === 'string' ? t : undefined,
    });
  });
};

watch([() => form.customerId, () => form.moveType, loads], calculateTariffDetails, {
  immediate: true,
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

const confirmSubmit = () => (showConfirm.value = true);
const goBack   = () => router.push('/orders');
const goToDetail = () => router.push({ name: 'detail order', query: { id: form.orderId } });


const submitForm = async () => {
  showConfirm.value = false;
  loading.value = true;
  loadsToFields();
  try {
    const res = await orderStore.updateOrder(form.orderId, { ...form });
    res.success ? (showSuccess.value = true) : (errorMessage.value = res.message || 'Gagal', showError.value = true);
  } catch {
    errorMessage.value = 'Terjadi kesalahan';
    showError.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<!--
  Template & style NYARIS sama dengan versi Anda sebelumnya.
  Tidak ada perubahan selain binding data baru already present.
-->


<template>
    <div class="flex h-screen">
      <Sidebar />
      <div class="flex-1 flex flex-col min-h-screen">
        <HeaderComponent title="Edit Order" />
        <div class="flex-1 p-4 main-content overflow-auto">
          <div class="container mx-auto max-w-4xl bg-white p-6 rounded shadow">
            <div class="header-container">
              <div class="header-content">
                <VButton title="Kembali" class="back-button" @click="goBack">
                  <i class="pi pi-arrow-left"></i>
                </VButton>
                <h1 class="header-title">Edit Booking Order</h1>
              </div>
            </div>
  
            <form @submit.prevent="confirmSubmit">
              <div class="form-grid">
                <div class="form-group">
                  <label for="customer">Customer <span class="text-red-500">*</span></label>
                  <input v-model="form.customerId" type="text" id="customerId" class="readonly-input" readonly />
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

            <h2 class="mt-6 font-bold">Container Data</h2>
            <ContainerLoadsTable v-model="loads" class="bg-[#f5f7fa] p-4 rounded-lg shadow-sm"/>

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
  
            <br>

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
          @close="goToDetail"
          :message="'Order baru berhasil terdaftar!'"
          buttonText="Kembali ke Detail Order"
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

  .readonly-input {
  background-color: #E3E3E8;  
  cursor: not-allowed;  
}
  </style>
  