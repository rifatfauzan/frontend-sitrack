<template>
    <Dialog :visible="visible" @close="closeDialog">
      <div class="error">
        <i class="pi pi-times-circle error-icon"></i>
        <h2 class="popup-title">Invalid</h2>
        <p>{{ message }}</p>
        <div class="popup-actions">
          <VButton @click="closeDialog" class="error-button">Kembali</VButton>
        </div>
      </div>
    </Dialog>
</template>
  
<script setup lang="ts">
    import Dialog from "@/components/Dialog.vue";
    import { defineProps, defineEmits } from "vue";
    import VButton from "@/components/VButton.vue";
    
    const props = defineProps({
        visible: Boolean,
        message: String,
    });
    
    const emit = defineEmits(["close"]);
    
    const closeDialog = () => {
        emit("close");
    };
</script>
  
<style scoped>
    .popup-title {
        font-size: 2rem;
        font-weight: bold;
    }

    .popup-actions {
        display: flex;
        justify-content: space-around;
        margin-top: 40px;
    }

    .error {
        padding: 30px;
        background-color: #eb5757;
        color: white;
        border-radius: 10px;
    }
    
    .error-icon {
        font-size: 100px;
        color: white;
        margin-bottom: 20px;
    }
    
    .error-button {
        background-color: white;
        color: black;
        transition: background-color 0.3s ease;
    }

    .error-button:hover {
        background-color: #e2e1e1;
}
</style>