<template>
    <div class="flex body">
        <Sidebar />

        <div class="flex-1 flex flex-col">
            <HeaderComponent title="Registrasi Pengguna" />
            <div class="flex-1 p-4 main-content pt-20">
                <div class="container mx-auto" style="max-width: 50%;">
                    <div class="create-user-view">
                        <div class="header-back">
                            <VButton title="" class="bg-[#1C5D99] text-white p-2 rounded" @click="goBack" :style="{ 'background-color': '#1C5D99' }">
                                <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                            </VButton>
                        </div>

                        <form @submit.prevent="confirmSubmit" class="bg-white p-6 rounded-lg shadow-md">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                                    Username
                                </label>
                                <input
                                    v-model="username"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="username"
                                    type="text"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                                    Password
                                </label>
                                <input
                                    v-model="password"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
                                    Role
                                </label>
                                <select
                                    v-model="selectedRole"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-[#E5EEFB]"
                                    id="role"
                                    required
                                >
                                    <option v-for="role in roles" :key="role.id" :value="role.name">
                                        {{ role.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="flex items-center justify-end">
                                <VButton title="Register" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" type="submit" :disabled="loading">
                                    {{ loading ? "Menyimpan..." : "Register" }}
                                </VButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>

        <ConfirmationDialog
            :visible="showConfirm"
            @close="showConfirm = false"
            @confirm="createUser"
            :message="'Apakah data pengguna baru sudah sesuai?'"
        />

        <SuccessDialog 
            :visible="showSuccess" 
            @close="goToList" 
            :message="'Pengguna baru berhasil terdaftar!'" 
            redirectTo="/users"
            buttonText="Kembali ke List Pengguna" 
        />

        <ErrorDialog
            :visible="showError"
            @close="showError = false"
            :message="errorMessage"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import SuccessDialog from '@/components/SuccessDialog.vue';
import ErrorDialog from '@/components/ErrorDialog.vue';
import { useUserStore } from '@/stores/user';
import { UserRequestInterface } from '@/interfaces/user.interfaces';
import router from '@/router';

export default defineComponent({
    name: 'CreateUserView',
    components: {
        Sidebar,
        HeaderComponent,
        FooterComponent,
        VButton,
        ConfirmationDialog,
        SuccessDialog,
        ErrorDialog,
    },
    setup() {
        const userStore = useUserStore();
        const username = ref('');
        const password = ref('');
        const selectedRole = ref('');
        const loading = ref(false);
        const showConfirm = ref(false);
        const showSuccess = ref(false);
        const showError = ref(false);
        const errorMessage = ref('');
        const roles = ref([
            { id: 2, name: 'Manager' },
            { id: 3, name: 'Supervisor' },
            { id: 4, name: 'Operasional' },
            { id: 5, name: 'Mekanik' },
        ]);

        const confirmSubmit = () => {
            showConfirm.value = true;
        };

        const createUser = async () => {
            showConfirm.value = false;
            loading.value = true;
            const newUser: UserRequestInterface = {
                username: username.value,
                password: password.value,
                role: selectedRole.value,
            };

            try {
                const result = await userStore.addUser(newUser);
                if (result.success) {
                    showSuccess.value = true;
                } else {
                    errorMessage.value = result.message || "Terjadi kesalahan saat menambahkan pengguna.";
                    showError.value = true;
                }
            } catch (err) {
                errorMessage.value = `${(err as Error).message}`;
                showError.value = true;
            } finally {
                loading.value = false;
            }
        };

        const goToList = () => {
            showSuccess.value = false;
            router.push('/users');
        };

        const goBack = () => {
            router.push('/users');
        };

        return {
            username,
            password,
            selectedRole,
            roles,
            createUser,
            userStore,
            goBack,
            loading,
            showConfirm,
            showSuccess,
            showError,
            errorMessage,
            confirmSubmit,
            goToList,
        };
    },
});
</script>
