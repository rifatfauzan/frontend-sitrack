<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAssetStore } from '@/stores/asset';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const assetStore = useAssetStore();
const { assetList, loading } = storeToRefs(assetStore);
const router = useRouter();

const filters = ref({
  global: { value: null }
});

const selectedRow = ref(null);

onMounted(async () => {
  await assetStore.fetchAssets();
});

const goToCreateAsset = () => {
  router.push('/assets/create');
};

</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="List Inventory Asset" />
      <div class="flex-1 p-4 overflow-auto bg-[#C8D9ED]">
        <div class="container mx-auto max-w-7xl p-6 rounded shadow bg-white">
          <div class="flex justify-between items-center mb-4">
            <InputText v-model="filters.global.value" placeholder="Search Assets" class="w-64" />
            <VButton title="+ Buat" class="bg-[#1C5D99] text-white px-4 py-2 rounded" @click="goToCreateAsset" />
          </div>

          <DataTable
            :value="assetList"
            paginator
            :rows="10"
            dataKey="assetId"
            :loading="loading"
            :globalFilterFields="['assetId', 'jenisAsset', 'brand']"
            v-model:filters="filters"
            stripedRows
            tableStyle="min-width: 100%"
            paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords} assets"
            class="custom-datatable"
          >
            <template #empty>No asset found.</template>
            <template #loading>Loading assets. Please wait.</template>

            <Column header="No." style="width: 5%">
              <template #body="{ index }">
                <div class="text-center">{{ index + 1 }}</div>
              </template>
            </Column>

            <Column field="assetId" header="ID" sortable />
            <Column field="jenisAsset" header="Type" sortable />
            <Column field="brand" header="Brand" sortable />
            <Column field="jumlahStok" header="Stock" sortable />
          </DataTable>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
/* Untuk hover row */
:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
  cursor: pointer;
}

/* Styling tombol search dan buat */
.flex input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
}

/* Warna latar belakang halaman */
.bg-[#C8D9ED] {
  background-color: #C8D9ED;
}
</style>
