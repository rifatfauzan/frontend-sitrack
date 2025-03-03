<template>
  <button 
    :type="type"
    @click="$emit('click')"
    class="bg-[#1C5D99] hover:bg-[#1C5D90] text-white font-bold py-3 px-12 rounded-md text-xl"
  >
    <slot>{{ title }}</slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'button'
  },
  title: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>
