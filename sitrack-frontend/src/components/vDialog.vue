<template>
    <transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog-box">
          <button class="close-button" @click="closeDialog">✕</button>
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  
  defineProps({
    visible: Boolean,
  });
  
  const emit = defineEmits(["close"]);
  
  const closeDialog = () => {
    emit("close");
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
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-box {
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
    width: 500px;
    max-width: 90vw;
    text-align: center;
    position: fixed;
    background: white;
    border-radius: 12px;
    padding: 1;
  }
  
  @media (max-width: 900px) {
    .dialog-box {
      width: 400px;
      max-width: 95vw;
      padding: 1;
    }
  }
  @media (max-width: 600px) {
    .dialog-box {
      width: 90vw;
      max-width: 350px;
      min-width: 0;
      padding: 0;
      border-radius: 10px;
    }
  }
  
  .close-button {
    position: absolute;
    top: 15px;
    right: 20px;
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: white;
  }
  .close-button:hover {
    color: black;
  }
  </style>
