<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
// import { useSopirStore } from '@/stores/sopir';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import router from '@/router';
import { useOrderStore } from '@/stores/order';
import { useRoute } from 'vue-router';
import { useCustomerStore } from '@/stores/customer';
import { watch } from 'vue';
import ContainerLoadsTable from '@/components/ContainerLoadsTable.vue';


const orderStore = useOrderStore();
const customerStore = useCustomerStore();

const toast = useToast();
const loading = ref(false);
const route = useRoute();

const showConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const errorMessage = ref("");

const goToDetail = () =>  router.push({ name: 'detail order', query: { id: form.orderId } });
const goBack = () => router.push('/orders');
const confirmSubmit = () => (showConfirm.value = true);

const form = reactive({
  orderId: '',
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

  qty120mt140fl: 0,
  qty145mt: 0,
  qty145fl: 0,
  qty145mtfl: 0,
});

/* tabel dinamis */
type LoadRow = { code:string; qty:number };
const loads = ref<LoadRow[]>([]);

/* mapping kode → chassis */
const loadCatalog: Record<string,{ chassis:20|40 , field:string }> = {
  // ---- 20
  '120MTFL':{ chassis:20, field:'qty120mtfl' },
  '120MT'  :{ chassis:20, field:'qty120mt'   },
  'CH120FL':{ chassis:20, field:'qtyCh120fl' },
  // ---- 40
  '220MTFL':      { chassis:40, field:'qty220mtfl' },
  '220MT':        { chassis:40, field:'qty220mt'   },
  '140MTFL':      { chassis:40, field:'qty140mtfl' },
  '140MT':        { chassis:40, field:'qty140mt'   },
  '120MT120FL':   { chassis:40, field:'qty120mt120fl' },
  '120MT220FL':   { chassis:40, field:'qty120mt220fl' },
  '220MT120FL':   { chassis:40, field:'qty220mt120fl' },
  '220MT220FL':   { chassis:40, field:'qty220mt220fl' },
  '120MT140FL':   { chassis:40, field:'qty120mt140fl' },
  'CH140FL':      { chassis:40, field:'qtyCh140fl' },
  'CH220FL':      { chassis:40, field:'qtyCh220fl' },
  '145MT':        { chassis:40, field:'qty145mt'   },
  '145FL':        { chassis:40, field:'qty145fl'   },
  '145MTFL':      { chassis:40, field:'qty145mtfl' },
};

/* ————————— helpers konversi lama ⇄ array loads ————————— */
function fieldsToLoads() {
  loads.value = [];
  Object.entries(loadCatalog).forEach(([code,{ field }])=>{
    const qty = (form as any)[field] || 0;
    if (qty>0) loads.value.push({ code, qty });
  });
}
function loadsToFields() {
  // reset semua qty field 0
  Object.values(loadCatalog).forEach(({field})=> (form as any)[field]=0 );
  loads.value.forEach(l => {
    if (!l.code || l.qty<=0) return;
    const field = loadCatalog[l.code].field;
    (form as any)[field] = l.qty;
  });
}

onMounted(async () => {
    const orderId = route.query.id as string;
    if (!orderId){
        toast.error("Order ID tidak ditemukan");
        router.push('/orders');
        return;
    }

    loading.value= true;

    try{
      await customerStore.fetchCustomers();
        const orderData = await orderStore.getOrderById(orderId);
        if (!orderData){
            toast.error("Data order tidak ditemukan");
            router.push('/orders');
            return;
        }

        Object.assign(form, orderData);
        fieldsToLoads();           

        calculateTariffDetails();
    } catch {
        toast.error("Terjadi kesalahan saat mengambil data order");
    } finally {
        loading.value = false;
    }
})

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

const needed = computed(()=>loads.value.reduce((a,l)=>{
  if (l.qty>0){
    const ch = loadCatalog[l.code].chassis;
    ch===20 ? a.ch20+=l.qty : a.ch40+=l.qty;
  }
  return a;
},{ ch20:0, ch40:0 }));

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

const submitForm = async () => {
  loading.value = true; 
  showConfirm.value = false;
  loadsToFields();

  try {
    const response = await orderStore.updateOrder(form.orderId,{
        customerId: form.customerId,
        orderDate: form.orderDate,
        siteId: form.siteId,
        moveType: form.moveType,
        downPayment: form.downPayment,
        remarksOperasional: form.remarksOperasional,
        qtyChassis20: form.qtyChassis20,
        qtyChassis40: form.qtyChassis40,
        qty120mtfl: form.qty120mtfl,
        qty120mt: form.qty120mt,
        qty220mtfl: form.qty220mtfl,
        qty220mt: form.qty220mt,
        qty140mtfl: form.qty140mtfl,
        qty140mt: form.qty140mt,
        qty120mt120fl: form.qty120mt120fl,
        qty120mt220fl: form.qty120mt220fl,
        qty220mt120fl: form.qty220mt120fl,
        qty220mt220fl: form.qty220mt220fl,
        qtyCh120fl: form.qtyCh120fl,
        qtyCh220fl: form.qtyCh220fl,
        qtyCh140fl: form.qtyCh140fl,

        
    });

    if (response.success) {
      showSuccess.value = true;
    } else {
      toast.error(response.message);
      errorMessage.value = response.message;
      showError.value = true;
    }
  } catch {
    toast.error('Terjadi kesalahan!');
    errorMessage.value ="Terjadi kesalahan!";
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
  
                <!-- <div class="form-group">
                  <label for="qtyChassis20">20' Chassis Quantity</label>
                  <input v-model.number="form.qtyChassis20" type="number" id="qtyChassis20" min="0" />
              </div>
  
              <div class="form-group">
                  <label for="qtyChassis40">40' Chassis Quantity</label>
                  <input v-model.number="form.qtyChassis40" type="number" id="qtyChassis40" min="0" />
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
              </div> -->

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
  