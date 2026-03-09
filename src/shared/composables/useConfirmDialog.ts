import { ref } from 'vue'

export function useConfirmDialog() {
  const isOpen = ref(false)
  const message = ref('')
  const itemToDelete = ref<any>(null)
  const onConfirmCallback = ref<(() => void | Promise<void>) | null>(null)

  function show(msg: string, item: any, onConfirm: () => void | Promise<void>) {
    message.value = msg
    itemToDelete.value = item
    onConfirmCallback.value = onConfirm
    isOpen.value = true
  }

  async function confirm() {
    if (onConfirmCallback.value) {
      await onConfirmCallback.value()
    }
    close()
  }

  function cancel() {
    close()
  }

  function close() {
    isOpen.value = false
    message.value = ''
    itemToDelete.value = null
    onConfirmCallback.value = null
  }

  return {
    isOpen,
    message,
    itemToDelete,
    show,
    confirm,
    cancel
  }
}
