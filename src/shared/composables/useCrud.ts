import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useAsyncState } from './useAsyncState'

interface CrudOperations<TCreate, TUpdate> {
  create: (dto: TCreate) => Promise<any>
  update: (id: string, dto: TUpdate) => Promise<any>
  delete: (id: string) => Promise<any>
}

interface CrudMessages {
  created: string
  updated: string
  deleted: string
  errorCreating: string
  errorUpdating: string
  errorDeleting: string
}

export function useCrud<_TDto, TCreate, TUpdate>(
  operations: CrudOperations<TCreate, TUpdate>,
  messages: CrudMessages,
  onRefresh?: () => void
) {
  const toast = useToast()
  const { t } = useI18n()
  const { loading, error, execute } = useAsyncState()

  async function create(dto: TCreate) {
    await execute(
      () => operations.create(dto),
      () => {
        toast.success(t(messages.created))
        if (onRefresh) onRefresh()
      },
      () => {
        toast.error(t(messages.errorCreating))
      }
    )
  }

  async function update(id: string, dto: TUpdate) {
    await execute(
      () => operations.update(id, dto),
      () => {
        toast.success(t(messages.updated))
        if (onRefresh) onRefresh()
      },
      () => {
        toast.error(t(messages.errorUpdating))
      }
    )
  }

  async function remove(id: string) {
    await execute(
      () => operations.delete(id),
      () => {
        toast.success(t(messages.deleted))
        if (onRefresh) onRefresh()
      },
      () => {
        toast.error(t(messages.errorDeleting))
      }
    )
  }

  return {
    loading,
    error,
    create,
    update,
    remove
  }
}
