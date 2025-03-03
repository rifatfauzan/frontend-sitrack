<template>
  <button 
    :type="type"
    @click="$emit('click')"
    class="bg-[#639FAB] hover:bg-[#63AB93] text-white font-bold py-3 px-12 rounded-md text-xl"
  >
    <slot>Login</slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'button'
  }
});

defineEmits(['click']);
</script>
