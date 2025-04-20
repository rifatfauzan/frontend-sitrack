<template>
    <div class="w-64 h-screen bg-[#222222] flex flex-col justify-between font-sans">
        <div class="flex items-center justify-center mb-8 bg-white rounded-bl-3xl h-24 w-full">
            <img src="@/assets/SiTrack.png" alt="Logo" class="h-24 w-auto">
        </div>

        <nav :class="['flex-1 ml-4 mr-6 overflow-y-auto no-scrollbar h-full', ['Operasional', 'Mekanik'].includes(authStore.role) ? 'mt-20' : 'mt-12']">
            <ul class="space-y-4 text-[#FAFAFF]">
                <li>
                    <router-link to="/home" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-home text-3xl"></i>
                        <span>Beranda</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/customer-booking" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-truck text-3xl"></i>
                        <span>Customer Booking</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/vehicle-out" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-arrow-right text-3xl"></i>
                        <span>Vehicle Out</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional'].includes(authStore.role)">
                    <router-link to="/vehicle-in" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-arrow-left text-3xl"></i>
                        <span>Vehicle In</span>
                    </router-link>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor'].includes(authStore.role)" class="relative">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item" @click="toggleReferenceMenu">
                        <i class="pi pi-list text-3xl"></i>
                        <span>Reference List</span>
                        <i class="pi pi-chevron-down pr-8 transition-opacity duration-300 mb-6 text-2xl"
                           :class="{ 'opacity-100': showReferenceMenu, 'opacity-0': !showReferenceMenu }"></i>
                    </div>
                    <ul v-if="showReferenceMenu" class="ml-6 mt-2 space-y-2">
                        <li>
                            <router-link to="/trucks" class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                                <i class="pi pi-truck text-2xl"></i>
                                <span>Truck</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/customers" class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                                <i class="pi pi-users text-2xl"></i>
                                <span>Customer</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/chassis" class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                                <i class="fas fa-trailer text-sm"></i>
                                <span>Chassis</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/sopir/viewall" class="flex items-center gap-4 cursor-pointer text-lg sidebar-item">
                                <i class="pi pi-user text-2xl"></i>
                                <span>Driver</span>
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional', 'Mekanik'].includes(authStore.role)" class="relative">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item" @click="toggleInventoryMenu">
                        <i class="pi pi-box text-3xl"></i>
                        <span>Inventory</span>
                        <i class="pi pi-chevron-down pr-8 transition-opacity duration-300 mb-4 text-2xl"
                           :class="{ 'opacity-100': showInventoryMenu, 'opacity-0': !showInventoryMenu }"></i>
                    </div>
                    <ul v-if="showInventoryMenu" class="ml-6 mt-2 space-y-2">
                        <li>
                            <router-link to="/assets" class="flex items-center gap-4 cursor-pointer text-sm sidebar-item">
                                <i class="fas fa-cube text-sm"></i>
                                <span>Asset</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/asset-request" class="flex items-center gap-4 cursor-pointer text-sm sidebar-item">
                                <i class="fas fa-file-signature text-sm"></i>
                                <span>Request Asset</span>
                            </router-link>
                        </li>
                    </ul>
                </li>

                <li v-if="['Admin', 'Manager', 'Supervisor', 'Operasional', 'Mekanik'].includes(authStore.role)">
                    <div class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-file-edit text-3xl"></i>
                        <span>Reporting</span>
                    </div>
                </li>
                
                <li v-if="authStore.role === 'Admin'">
                    <router-link to="/users" class="flex items-center gap-4 cursor-pointer text-2xl sidebar-item">
                        <i class="pi pi-user-edit text-3xl"></i>
                        <span>User Management</span>
                    </router-link>
                </li>
            </ul>
        </nav>

        <div class="bg-white p-4 rounded-t-2xl space-y-4 h-34 mt-10">
            <div class="bg-[#BBCDE5] rounded-full p-4 flex items-center justify-center space-x-4 text-lg pr-6">
                <i class="fas fa-user-alt text-base"></i>
                <span>{{ authStore.username }}</span>
            </div>
            <div @click="authStore.logout()" class="text-[#EB5757] flex items-center justify-center cursor-pointer font-bold text-lg mr-2 logout-button">
                <i class="pi pi-sign-out text-2xl"></i>
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
const showInventoryMenu = ref(false);

const toggleReferenceMenu = () => {
    showReferenceMenu.value = !showReferenceMenu.value;
};

const toggleInventoryMenu = () => {
    showInventoryMenu.value = !showInventoryMenu.value;
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