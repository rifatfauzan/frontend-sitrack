<template>
    <div class="flex flex-col min-h-screen">
        <div class="fixed left-0 top-0 bottom-0 w-64 bg-gray-800">
            <Sidebar />
        </div>
        <div class="main-content">
            <div class="fixed top-0 left-64 right-0 h-16 bg-gray-200 z-10">
                <HeaderComponent title="" />
            </div>
            <div class="pb-8 px-4">
                <div class="flex">
                    <div class="flex-1">
                        <div class="flex flex-col items-center justify-center w-full h-screen relative">
                            <h1 class="text-8xl font-bold text-[#FAFAFF]">
                                Akses <span class="text-[#EB5757]">Ditolak!</span>
                            </h1>
                            <p class="text-2xl text-[#FAFAFF] mt-4">
                                Anda tidak memiliki izin untuk mengakses halaman ini
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-64 right-0 h-16 bg-gray-200">
            <FooterComponent />
        </div>
    </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import FooterComponent from '@/components/Footer.vue';
import HeaderComponent from '@/components/Header.vue';
</script>

<style scoped>
body {
    margin: 0;
}

.main-content {
    margin-left: 16rem;
    overflow-y: auto;
    background-color: #BBCDE5;
}
</style>
