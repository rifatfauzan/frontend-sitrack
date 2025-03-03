<template>
    <div class="w-64 h-screen bg-[#222222] flex flex-col justify-between font-sans">
        <div class="flex items-center justify-center mb-8 bg-white rounded-bl-3xl h-24 w-full">
            <img src="@/assets/SiTrack.png" alt="Logo" class="h-24 w-auto">
        </div>

        <nav class="flex-1 ml-4 mr-6 mt-16">
            <ul class="space-y-4 text-[#FAFAFF]">
                <!-- Memastikan ikon dan teks sejajar dengan penggunaan flex dan menambahkan gap -->
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-home"></i> <!-- Ikon -->
                    <span>Beranda</span> <!-- Teks -->
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-truck"></i>
                    <span>Customer Booking</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-arrow-right"></i>
                    <span>Vehicle Out</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-arrow-left"></i>
                    <span>Vehicle In</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-th-list"></i>
                    <span>Reference List</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-box"></i>
                    <span>Inventory</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="fas fa-file-alt"></i>
                    <span>Reporting</span>
                </li>
                <li class="flex items-center gap-4 cursor-pointer text-xl sidebar-item">
                    <i class="pi pi-user" style="font-size: 1.7rem"></i>
                    <span>User Management</span>
                </li>
            </ul>
        </nav>

        <!-- Bagian ini tidak terpengaruh oleh styling di atas -->
        <div class="bg-white p-4 rounded-t-2xl space-y-4 h-32 mt-auto">
            <div class="bg-[#BBCDE5] rounded-full p-4 flex items-center justify-center space-x-4 text-xl pr-6">
                <i class="fas fa-user"></i> <!-- Ikon normal untuk user -->
                <span>{{ authStore.username }}</span>
            </div>
            <div @click="authStore.logout()" class="text-[#EB5757] flex items-center justify-center cursor-pointer font-bold text-xl pr-6 logout-button">
                <i class="fas fa-sign-out-alt"></i>
                <span class="ml-2">Log Out</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.ts';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
    authStore.initUser();
});
</script>

<script>
export default {
    name: 'Sidebar',
};
</script>

<style scoped>
@import "@/assets/index.css";
</style>
