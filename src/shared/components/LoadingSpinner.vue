<template>
  <div class="loading-spinner-container" :class="{ 'overlay': overlay }">
    <div class="loading-spinner-content">
      <div class="spinner" :class="sizeClass">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  message?: string
  overlay?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  message: '',
  overlay: false,
  size: 'medium'
})

const sizeClass = computed(() => `spinner-${props.size}`)
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loading-spinner-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9998;
  padding: 0;
}

.loading-spinner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.spinner > div {
  background-color: #42b883;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner-small > div {
  width: 8px;
  height: 8px;
}

.spinner-medium > div {
  width: 12px;
  height: 12px;
}

.spinner-large > div {
  width: 18px;
  height: 18px;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-message {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
}
</style>
