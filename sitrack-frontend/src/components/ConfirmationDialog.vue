<template>
    <Dialog :visible="visible" @close="closeDialog">
      <div class="confirmation">
        <h2 class="popup-title">Konfirmasi</h2>
        <p>{{ message }}</p>
        <div class="popup-actions">
          <VButton @click="closeDialog" class="cancel-button">Kembali</VButton>
          <VButton @click="confirmAction" class="confirm-button">Confirm</VButton>
        </div>
      </div>
    </Dialog>
</template>
  
<script setup lang="ts">
    import Dialog from "@/components/vDialog.vue";
    import { defineProps, defineEmits } from "vue";
    import VButton from "@/components/VButton.vue";
    
    defineProps({
        visible: Boolean,
        message: String,
    });
    
    const emit = defineEmits(["close", "confirm"]);
    
    const closeDialog = () => {
        emit("close");
    };
    
    const confirmAction = () => {
        emit("confirm");
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

    .confirmation {
        padding: 30px;
        background-color: #bbcde5;
        border-radius: 10px;
    }

    .cancel-button {
        background-color: #639fab;
        color: white;
        transition: background-color 0.3s ease;
    }

    .confirm-button {
        background-color: #1c5d99;
        color: white;
        transition: background-color 0.3s ease;
    }

    .cancel-button:hover {
        background-color: #5b8ea6;
    }
    
    .confirm-button:hover {
        background-color: #174d7a;
    }

    @media (max-width: 600px) {
        .confirmation {
            padding: 16px 6px;
        }
        .popup-title {
            font-size: 1.2rem;
        }
        .popup-actions {
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
        }
    }
</style>

