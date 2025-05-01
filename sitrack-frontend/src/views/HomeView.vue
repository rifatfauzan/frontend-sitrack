<script setup lang="ts">
import SiTrack from '../components/SiTrack.vue'
import Sidebar from '@/components/vSidebar.vue';
import FooterComponent from '@/components/vFooter.vue';
import HeaderComponent from '@/components/vHeader.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="fixed left-0 top-0 bottom-0 w-64 bg-gray-800">
      <Sidebar />
    </div>
    <div class="main-content">
      <div class="fixed top-0 left-64 right-0 h-16 bg-gray-200 z-10">
        <HeaderComponent title="Beranda"/>
      </div>
      <div class="pb-8 px-4">
        <SiTrack />
      </div>
    </div>
    <div class="fixed bottom-0 left-64 right-0 h-16 bg-gray-200">
      <FooterComponent />
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
}

.main-content {
  margin-left: 16rem;
  overflow-y: auto;
}
</style>
