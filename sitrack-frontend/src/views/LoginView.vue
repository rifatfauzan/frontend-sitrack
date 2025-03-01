<template>
    <div class="flex h-screen">
      <!-- Left Section -->
      <div class="w-1/2 bg-white flex items-center justify-center">
        <div class="text-center">
        <h1 class="text-5xl font-bold text-[#1C5D99]">Selamat datang di</h1>
          <img src="@/assets/SiTrack.png" alt="SiTrack Logo"/>
          <h2 class="text-5xl font-bold text-[#1C5D99]">Sistem Informasi Tracking</h2>
          <h2 class="text-3xl font-bold text-[#1C5D99]">PT. Glorious Interbuana</h2>
        </div>
      </div>
  
      <div class="w-1/2 bg-[#1C5D99] flex items-center justify-center">
        <div class="w-2/3">
          <VInput id="username" label="Username" v-model="credentials.username" />
          <VInput id="password" type="password" label="Password" v-model="credentials.password" />
          <div class="flex justify-center mt-4">
            <VButton @click="handleLogin">Login</VButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import VInput from '@/components/VInput.vue';
  import VButton from '@/components/VButton.vue';
  
  const auth = useAuthStore();
  
  const credentials = ref({
    username: '',
    password: ''
  });
  
  const handleLogin = () => {
    auth.login(credentials.value);
  };
  </script>
  