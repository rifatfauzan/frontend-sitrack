<template>
    <div class="flex body">
        <Sidebar />

        <div class="flex-1 flex flex-col">
            <HeaderComponent title="Edit Pengguna" />
            <div class="flex-1 p-4 main-content pt-20">
                <div class="container mx-auto" style="max-width: 50%;">
                    <div class="edit-user-view">
                        <div class="header-back">
                            <VButton title="" class="bg-[#1C5D99] text-white p-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                                <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                            </VButton>
                        </div>

                        <form @submit.prevent="confirmEdit" class="bg-white p-6 rounded-lg shadow-md">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                    Username
                                </label>
                                <input
                                    v-model="userData.username"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                    Password (Optional)
                                </label>
                                <input
                                    v-model="userData.password"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
                                    Role
                                </label>
                                <select
                                    v-model="userData.role"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="role"
                                    required
                                >
                                    <option v-for="role in roles" :key="role" :value="role">
                                        {{ role }}
                                    </option>
                                </select>
                            </div>

                            <div class="flex items-center justify-end space-x-4">
                                <VButton title="Delete" class="bg-[#EB5757] hover:bg-[#C64646] text-white px-4 py-2 rounded w-full" @click="confirmDelete" :disabled="loading">
                                    {{ loading ? "Menghapus..." : "Delete" }}
                                </VButton>
                                <VButton title="Update" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" type="submit" :disabled="loading">
                                    {{ loading ? "Menyimpan..." : "Update" }}
                                </VButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>

        <ConfirmationDialog
            :visible="showEditConfirm"
            @close="showEditConfirm = false"
            @confirm="editUser"
            :message="'Apakah Anda yakin ingin mengubah data pengguna ini?'"/>

        <ConfirmationDialog
            :visible="showDeleteConfirm"
            @close="showDeleteConfirm = false"
            @confirm="deleteUser"
            :message="'Apakah Anda yakin ingin menghapus pengguna ini?'"/>

        <SuccessDialog 
            :visible="showSuccess" 
            @close="goToList" 
            :message="successMessage" 
            redirectTo="/users"
            buttonText="Kembali ke List Pengguna" />

        <ErrorDialog
            :visible="showError"
            @close="showError = false"
            :message="errorMessage"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { UpdateUserRequestInterface } from '@/interfaces/user.interfaces';
import Sidebar from '@/components/vSidebar.vue';
import HeaderComponent from '@/components/vHeader.vue';
import FooterComponent from '@/components/vFooter.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const roles = ['Manager', 'Supervisor', 'Operasional', 'Mekanik'];

const userData = ref<UpdateUserRequestInterface>({
    id: 0,
    username: '',
    password: '',
    role: ''
});

const loading = ref(false);
const showEditConfirm = ref(false);
const showDeleteConfirm = ref(false);
const showSuccess = ref(false);
const showError = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

onMounted(async () => {
    const userId = Number(route.query.id);
    if (userId) {
        const user = await userStore.getUserById(userId);
        if (user) {
            userData.value = { ...user, password: '' };
        } else {
            errorMessage.value = 'User tidak ditemukan!';
            showError.value = true;
        }
    }
});

const goBack = () => {
    router.push('/users');
};

const confirmEdit = () => {
    showEditConfirm.value = true;
};

const confirmDelete = () => {
    showDeleteConfirm.value = true;
};

const editUser = async () => {
    showEditConfirm.value = false;
    loading.value = true;
    try {
        const result = await userStore.updateUser(userData.value);
        if (result.success) {
            successMessage.value = result.message;
            showSuccess.value = true;
        } else {
            errorMessage.value = result.message;
            showError.value = true;
        }
    } catch (err) {
        errorMessage.value = (err as Error).message;
        showError.value = true;
    } finally {
        loading.value = false;
    }
};

const deleteUser = async () => {
    showDeleteConfirm.value = false;
    loading.value = true;
    try {
        const result = await userStore.deleteUser(userData.value.id);
        if (result.success) {
            successMessage.value = result.message;
            showSuccess.value = true;
        } else {
            errorMessage.value = result.message;
            showError.value = true;
        }
    } catch (err) {
        errorMessage.value = (err as Error).message;
        showError.value = true;
    } finally {
        loading.value = false;
    }
};

const goToList = () => {
    showSuccess.value = false;
    router.push('/users');
};
</script>
