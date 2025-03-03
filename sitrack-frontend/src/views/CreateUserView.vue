<template>
    <div class="flex body">
        <Sidebar />

        <div class="flex-1 flex flex-col">
            <HeaderComponent title="Registrasi Pengguna" />
            <div class="flex-1 p-4 main-content pt-20">
                <div class="container mx-auto" style="max-width: 50%;">
                    <div class="create-user-view">
                        <div class="header-back">
                            <VButton title="" class="bg-[#1C5D99] text-white p-2 rounded" @click="goBack">
                                <i class="pi pi-arrow-left" style="font-size: 1rem; margin-right: 2rem"></i>
                            </VButton>
                        </div>

                        <form @submit.prevent="createUser" class="bg-white p-6 rounded-lg shadow-md">
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
                                <VButton title="Register" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" @click="createUser" />
                            </div>
                            <div v-if="userStore.error" class="text-red-500 mt-4">{{ userStore.error }}</div>
                        </form>
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';
import { useUserStore } from '@/stores/user';
import { UserRequestInterface } from '@/interfaces/user.interfaces';
import { useToast } from 'vue-toastification';
import router from '@/router';

export default defineComponent({
    name: 'CreateUserView',
    components: {
        Sidebar,
        HeaderComponent,
        FooterComponent,
        VButton,
    },
    setup() {
        const userStore = useUserStore();
        const username = ref('');
        const password = ref('');
        const selectedRole = ref('');
        const roles = ref([
            { id: 2, name: 'Manager' },
            { id: 3, name: 'Supervisor' },
            { id: 4, name: 'Operasional' },
            { id: 5, name: 'Mekanik' },
        ]);

        const createUser = async () => {
            const newUser: UserRequestInterface = {
                username: username.value,
                password: password.value,
                role: selectedRole.value,
            };

            console.log('Memulai createUser dengan data:', newUser);
            try {
                await userStore.addUser(newUser);
                console.log('Selesai createUser, Status error:', userStore.error);
                if (!userStore.error) {
                    useToast().success('Pengguna berhasil ditambahkan!');
                    username.value = '';
                    password.value = '';
                    selectedRole.value = '';
                    await router.push('/users');
                } else {
                    useToast().error(userStore.error);
                }
            } catch (err) {
                console.error('Error di createUser:', err);
                useToast().error(`Gagal menambahkan akun: ${(err as Error).message}`);
            }
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
        };
    },
});
</script>