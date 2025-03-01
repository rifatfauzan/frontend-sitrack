<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import Sidebar from '@/components/Sidebar.vue';
</script>

<template>
  <div class="flex">
    <Sidebar />
    
    <div class="flex-1">
      <TheWelcome />
    </div>
  </div>
</template>
