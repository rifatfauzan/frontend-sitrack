<template>
    <header class="header flex justify-between items-center h-24 w-full px-4">
        <h1 class="text-5xl font-bold pl-4">{{ title }}</h1>
        <button class="relative">
            <i class="fas fa-bell text-2xl pr-6"></i>
        </button>
    </header>
</template>

<script setup lang="ts">
export default {
    props: {
        title: {
            type: String,
            default: "Default Title"
        }
    }
};
</script>
