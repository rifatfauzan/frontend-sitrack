<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
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
// import { useCustomerStore } from '@/stores/customer';

const orderStore = useOrderStore();
// const customerStore = useCustomerStore();

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

onMounted(async () => {
    const orderId = route.query.id as string;
    if (!orderId){
        toast.error("Order ID tidak ditemukan");
        router.push('/orders');
        return;
    }

    loading.value= true;

    try{
        const orderData = await orderStore.getOrderById(orderId);
        if (!orderData){
            toast.error("Data order tidak ditemukan");
            router.push('/orders');
            return;
        }

        Object.assign(form, orderData);
    } catch {
        toast.error("Terjadi kesalahan saat mengambil data order");
    } finally {
        loading.value = false;
    }
})


const submitForm = async () => {
  loading.value = true; 
  showConfirm.value = false;

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
  
                <div class="form-group">
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
              </div>
  
  
              <br>
  
  
              <div class="form-group full-width">
                  <label for="remarksOperasional">Remarks</label>
                  <textarea v-model="form.remarksOperasional" id="remarksOperasional" maxlength="300"></textarea>
              <!-- <input v-model="form.remarksOperasional" type="text" id="remarksOperasional" /> -->
              </div>
  
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
  