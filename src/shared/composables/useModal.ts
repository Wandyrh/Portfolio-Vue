import { ref } from 'vue'

export type ModalMode = 'create' | 'edit'

export function useModal<T = any>() {
  const isOpen = ref(false)
  const mode = ref<ModalMode>('create')
  const selectedItem = ref<T | null>(null)

  function openCreate() {
    mode.value = 'create'
    selectedItem.value = null
    isOpen.value = true
  }

  function openEdit(item: T) {
    mode.value = 'edit'
    selectedItem.value = item
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    selectedItem.value = null
  }

  return {
    isOpen,
    mode,
    selectedItem,
    openCreate,
    openEdit,
    close
  }
}
