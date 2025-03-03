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

                        <form @submit.prevent="editUser" class="bg-white p-6 rounded-lg shadow-md">
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
                                <VButton title="Delete" class="bg-[#EB5757] hover:bg-[#C64646] text-white px-4 py-2 rounded w-full" @click="deleteUser(userData.id)" />
                                <VButton title="Update" class="bg-[#1C5D99] text-white px-4 py-2 rounded w-full" @click="editUser" />
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

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { UpdateUserRequestInterface } from '@/interfaces/user.interfaces';
import { useToast } from 'vue-toastification';
import Sidebar from '@/components/Sidebar.vue';
import HeaderComponent from '@/components/Header.vue';
import FooterComponent from '@/components/Footer.vue';
import VButton from '@/components/VButton.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const roles = ['Manager', 'Supervisor', 'Operasional', 'Mekanik'];

const userData = ref<UpdateUserRequestInterface>({
    id: 0,
    username: '',
    password: '',
    role: ''
});

onMounted(async () => {
    const userId = Number(route.query.id);
    if (userId) {
        const user = await userStore.getUserById(userId);
        if (user) {
            userData.value.id = user.id;
            userData.value.username = user.username;
            userData.value.role = user.role;
        } else {
            toast.error('User tidak ditemukan!');
            router.push('/users');
        }
    }
});

const goBack = () => {
    router.push('/users');
};

const editUser = async () => {
    const result = await userStore.updateUser(userData.value);
    if (result.success) {
        toast.success(result.message);
        router.push('/users');
    } else {
        toast.error(result.message);
    }
};

const deleteUser = async (id: number) => {
    if (id) {
        const result = await userStore.deleteUser(id);
        if (result.success) {
            toast.success(result.message);
            router.push('/users');
        } else {
            toast.error(result.message);
        }
    } else {
        toast.error("User ID tidak ditemukan!");
    }
};
</script>
