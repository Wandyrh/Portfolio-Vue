<template>
  <div class="language-selector">
    <select v-model="selected" @change="changeLanguage" class="form-select form-select-sm">
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '@/shared/stores/language'

const languageStore = useLanguageStore()
const { locale } = useI18n()
const selected = ref(languageStore.language)

watch(selected, (val) => {
  languageStore.setLanguage(val)
  locale.value = val
})

function changeLanguage() {
  languageStore.setLanguage(selected.value)
  locale.value = selected.value
}
</script>

<style scoped>
.language-selector {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.language-selector .form-select {
  border-color: #28a745 !important;
}
.language-selector .form-select:focus,
.language-selector .form-select:hover {
  border-color: #28a745 !important;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
}
</style>