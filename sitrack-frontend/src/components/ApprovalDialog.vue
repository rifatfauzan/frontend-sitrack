<template>
    <transition name="fade">
      <div v-if="visible" class="overlay" @click.self="close">
        <div class="approval-dialog">
          <button class="close-button" @click="close">✕</button>
  
          <div class="approval-content">
            <h2 class="popup-title">{{ title }}</h2>
  
            <div class="field">
              <label>{{ label }}</label>
              <textarea
                v-model="localRemarks"
                placeholder="Isi alasan jika perlu..."
                class="textarea"
              />
            </div>
  
            <div class="actions">
              <VButton @click="handleReject" class="reject-button">Reject</VButton>
              <VButton @click="handleRevision" class="revision-button">Request Revision</VButton>
              <VButton @click="handleApprove" class="approve-button">Approve</VButton>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import VButton from '@/components/VButton.vue';
  
  defineProps({
    visible: Boolean,
    title: { type: String, default: "Approval" },
    label: { type: String, default: "Remarks:" },
  });
  
  const emit = defineEmits(["close", "approve", "revision", "reject"]);
  
  const localRemarks = ref("");
  
  const close = () => {
    emit("close");
  };
  
  const handleApprove = () => {
    emit("approve", localRemarks.value);
  };
  
  const handleRevision = () => {
    emit("revision", localRemarks.value);
  };
  
  const handleReject = () => {
    emit("reject", localRemarks.value);
  };
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .approval-dialog {
    background-color: #bbcde5;
    border-radius: 12px;
    width: 700px;
    padding: 30px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 12px;
    right: 20px;
    background: none;
    border: none;
    font-size: 22px;
    color: black;
    cursor: pointer;
  }
  
  .popup-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .field {
    margin-bottom: 24px;
    text-align: left;
  }
  
  .field label {
    font-weight: bold;
    margin-bottom: 8px;
    display: block;
  }
  
  .textarea {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    resize: none;
    min-height: 100px;
    font-size: 1rem;
    color: black;
    background-color: white;
  }
  
  .textarea::placeholder {
    color: #9ca3af;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;
  }
  
  .reject-button {
    background-color: #eb5757;
    color: white;
  }
  
  .revision-button {
    background-color: #f7b500;
    color: white;
  }
  
  .approve-button {
    background-color: #27ae60;
    color: white;
  }
  </style>
  