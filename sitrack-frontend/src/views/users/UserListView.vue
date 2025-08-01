<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col min-h-screen">
      <HeaderComponent title="List Pengguna" />
      <div class="flex-1 p-4 main-content overflow-auto">
        <div class="container mx-auto max-w-4xl">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <span class="p-input-icon-left">
                <InputText v-model="filters['global'].value" placeholder="Search Keyword..." />
              </span>
              <VButton
                title="+ Buat"
                class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                @click="() => $router.push('/users/create')"
              />
            </div>
            <DataTable
              v-model:filters="filters"
              :value="userStore.users"
              paginator
              :rows="10"
              dataKey="id"
              :rowsPerPageOptions="[5, 10, 20]" 
              filterDisplay="menu"
              :loading="loading"
              :globalFilterFields="['username', 'role']"
              stripedRows
              tableStyle="min-width: 50rem"
              paginatorTemplate="RowsPerPageDropdown PrevPageLink CurrentPageReport NextPageLink"
              currentPageReportTemplate="{first} to {last}"
              class="custom-datatable"
            >
              <template #empty> No users found. </template>
              <template #loading> Loading user data. Please wait. </template>

              <Column header="No." style="width: 5%">
                <template #body="{ index }">
                  <div class="text-center">{{ index + 1 }}</div>
                </template>
              </Column>

              <Column field="username" header="Username" class="p-sortable-column" style="min-width: 25%" sortable>
                <template #body="{ data }">
                  {{ data.username }}
                </template>
              </Column>

              <Column field="role" header="Role" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                  {{ data.role }}
                </template>
              </Column>

              <Column header="Actions" style="width: 10%">
                <template #body="slotProps">
                  <div class="flex justify-center">
                    <VButton
                      title="Edit"
                      class="bg-[#1C5D99] text-white px-4 py-2 rounded"
                      @click="() => $router.push({ name: 'edit users', query: { id: slotProps.data.id } })"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';

const userStore = useUserStore();
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  role: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

onMounted(async () => {
  await userStore.fetchUsers();
  loading.value = false;
});
</script>

<style scoped>
:deep(.p-inputtext) {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
}
</style>