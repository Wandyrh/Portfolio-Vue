<template>
  <div class="skeleton-table">
    <table class="table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col" class="skeleton-header">
            <div class="skeleton-line"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row">
          <td v-for="col in columns" :key="col" class="skeleton-cell">
            <div class="skeleton-line" :style="getRandomWidth()"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columns: 4
})

// Generate random widths for realistic skeleton effect
function getRandomWidth() {
  const widths = ['60%', '70%', '80%', '90%', '100%']
  return { width: widths[Math.floor(Math.random() * widths.length)] }
}
</script>

<style scoped>
.skeleton-table {
  width: 100%;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.skeleton-header,
.skeleton-cell {
  padding: 0.75rem;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-header .skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    #e8e8e8 25%,
    #d8d8d8 50%,
    #e8e8e8 75%
  );
  background-size: 200% 100%;
  font-weight: 600;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Ensure consistent spacing */
.skeleton-cell:first-child .skeleton-line {
  max-width: 150px;
}

.skeleton-cell:last-child .skeleton-line {
  max-width: 100px;
}
</style>
