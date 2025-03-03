<template>
    <div class="mb-6">
        <label :for="id" class="block text-[#FAFAFF] text-lg mb-2">{{ label }}</label>
        <input 
            :type="type" 
            :id="id" 
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full p-3 rounded-md bg-[#BBCDE5] text-lg text-gray-800 border border-gray-300"
            :required="required"
        />
    </div>
</template>

<script setup lang="ts">
defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    modelValue: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    required: {
        type: Boolean,
        default: false
    }
});

defineEmits(['update:modelValue']);
</script>
