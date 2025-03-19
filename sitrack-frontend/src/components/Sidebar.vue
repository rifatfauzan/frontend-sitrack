<template>
    <div class="w-64 h-screen bg-[#222222] flex flex-col justify-between font-sans">
        <div class="flex items-center justify-center mb-8 bg-white rounded-bl-3xl h-24 w-full">
            <img src="@/assets/SiTrack.png" alt="Logo" class="h-24 w-auto">
        </div>

        <nav :class="['flex-1 ml-4 mr-6 overflow-y-auto no-scrollbar h-full', ['Operasional', 'Mekanik'].includes(authStore.role) ? 'mt-20' : 'mt-12']">
            <ul class="space-y-4 text-[#FAFAFF]">
                <li>
                    <router-link to="/home" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-home"></i>
                        <span>Beranda</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/customer-booking" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-truck"></i>
                        <span>Customer Booking</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/vehicle-out" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-arrow-right"></i>
                        <span>Vehicle Out</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/vehicle-in" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-arrow-left"></i>
                        <span>Vehicle In</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor'].includes(authStore.role)" class="relative">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item" @click="toggleReferenceMenu">
                        <i class="fas fa-th-list"></i>
                        <span>Reference List</span>
                        <i class="fas fa-chevron-down pr-8 transition-opacity duration-300 mb-6" :class="{ 'opacity-100': showReferenceMenu, 'opacity-0': !showReferenceMenu }"></i>
                    </div>
                    <ul v-if="showReferenceMenu" class="ml-6 mt-2 space-y-2">
                        <li class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                            <i class="fas fa-truck"></i>
                            <span>Truck</span>
                        </li>
                        <li>
                            <router-link to="/customers" class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                                <i class="fas fa-users"></i>
                                <span>Customer</span>
                            </router-link>
                        </li>
                        <li class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                            <i class="fas fa-trailer"></i>
                            <span>Chassis</span>
                        </li>
                        <li class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                            <i class="fas fa-id-badge"></i>
                            <span>Driver</span>
                        </li>
                    </ul>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional', 'Mekanik'].includes(authStore.role)">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-box"></i>
                        <span>Inventory</span>
                    </div>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional', 'Mekanik'].includes(authStore.role)">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="fas fa-file-alt"></i>
                        <span>Reporting</span>
                    </div>
                </li>
                
                <li v-if="authStore.role === 'Admin'">
                    <router-link to="/users" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-user" style="font-size: 1.7rem"></i>
                        <span>User Management</span>
                    </router-link>
                </li>
            </ul>
        </nav>

        <div class="bg-white p-4 rounded-t-2xl space-y-4 h-34 mt-10">
            <div class="bg-[#BBCDE5] rounded-full p-4 flex items-center justify-center space-x-4 text-lg pr-6">
                <i class="fas fa-user"></i>
                <span>{{ authStore.username }}</span>
            </div>
            <div @click="authStore.logout()" class="text-[#EB5757] flex items-center justify-center cursor-pointer font-bold text-lg mr-2 logout-button">
                <i class="fas fa-sign-out-alt"></i>
                <span class="ml-2">Log Out</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.ts';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
const showReferenceMenu = ref(false);

const toggleReferenceMenu = () => {
    showReferenceMenu.value = !showReferenceMenu.value;
};

onMounted(() => {
    authStore.initUser();
});
</script>

<script>
export default {
    name: 'Sidebar',
};
</script>

<style>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
    overflow-y: auto;
}
</style>
