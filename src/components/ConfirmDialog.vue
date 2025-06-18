<template>
  <div v-if="show">
    <div class="modal-backdrop fade show confirm-backdrop"></div>
    <div class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="$emit('cancel')"></button>
          </div>
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('cancel')">
              Cancel
            </button>
            <button type="button" class="btn btn-success confirm-btn" @click="$emit('confirm')">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',
  props: {
    show: { type: Boolean, required: true },
    title: { type: String, default: 'Confirm' },
    message: { type: String, required: true }
  },
  emits: ['confirm', 'cancel']
});
</script>

<style scoped>
.confirm-backdrop {
  z-index: 1050 !important;
}
</style>