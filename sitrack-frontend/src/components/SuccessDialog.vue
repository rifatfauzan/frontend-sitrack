<template>
    <Dialog :visible="visible" @close="closeDialog">
      <div class="success">
        <i class="pi pi-check-circle success-icon"></i>
        <h2 class="popup-title">Success</h2>
        <p>{{ message }}</p>
        <div class="popup-actions">
          <VButton @click="handleRedirect" class="success-button">{{ buttonText }}</VButton>
        </div>
      </div>
    </Dialog>
</template>
  
<script setup lang="ts">
    import Dialog from "@/components/vDialog.vue";
    import { defineProps, defineEmits } from "vue";
    import VButton from "@/components/VButton.vue";
    import { useRouter } from "vue-router";

    const router = useRouter();

    const props = defineProps({
        visible: Boolean,
        message: String,
        redirectTo: String,
        buttonText: {
            type: String,
            default: "Kembali Ke List"
        }
    });
    
    const emit = defineEmits(["close"]);
    
    const closeDialog = () => {
        emit("close");
    };

    const handleRedirect = () => {
        if (props.redirectTo) {
            router.push(props.redirectTo);
        }
        closeDialog();
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

    .success {
        padding: 30px;
        background-color: #27ae60;
        color: white;
        border-radius: 10px;
    }

    .success-icon{
        font-size: 100px;
        color: white;
        margin-bottom: 20px;
    }
    
    .success-button {
        background-color: white;
        color: black;
        transition: background-color 0.3s ease;
    }

    .success-button:hover {
        background-color: #e2e1e1;
    }

    @media (max-width: 600px) {
        .success {
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
        .success-icon {
            font-size: 60px;
            margin-bottom: 10px;
        }
    }
</style>
