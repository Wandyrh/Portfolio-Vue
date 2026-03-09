<template>
  <Transition name="loading-bar">
    <div v-if="loadingStore.isLoading" class="loading-bar-container">
      <div 
        class="loading-bar" 
        :style="{ width: `${loadingStore.loadingProgress}%` }"
      ></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/shared/stores/loading'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.loading-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.05);
}

.loading-bar {
  height: 100%;
  background: linear-gradient(90deg, #42b883 0%, #35495e 100%);
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.5);
}

.loading-bar-enter-active,
.loading-bar-leave-active {
  transition: opacity 0.3s ease;
}

.loading-bar-enter-from,
.loading-bar-leave-to {
  opacity: 0;
}
</style>
