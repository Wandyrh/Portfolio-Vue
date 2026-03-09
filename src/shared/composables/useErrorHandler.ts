import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { ApiError, ErrorType, createApiError, isNetworkError } from '@/shared/types/error'

export function useErrorHandler() {
  const toast = useToast()
  const { t } = useI18n()

  const getErrorMessage = (error: ApiError): string => {
    const key = `errors.${error.type.toLowerCase()}`
    const translatedMessage = t(key)
    
    if (translatedMessage === key) {
      return error.message
    }
    
    return translatedMessage
  }

  const handleError = (error: unknown, options?: { 
    silent?: boolean
    customMessage?: string
    showToast?: boolean
  }): ApiError => {
    const { silent = false, customMessage, showToast = true } = options || {}

    let apiError: ApiError

    if (error instanceof ApiError) {
      apiError = error
    } else if (isNetworkError(error)) {
      apiError = new ApiError(
        customMessage || t('errors.network') || 'Network connection error',
        ErrorType.NETWORK,
        undefined,
        error
      )
    } else if (error instanceof Error) {
      apiError = new ApiError(
        customMessage || error.message,
        ErrorType.UNKNOWN,
        undefined,
        error
      )
    } else {
      apiError = new ApiError(
        customMessage || 'An unexpected error occurred',
        ErrorType.UNKNOWN,
        undefined,
        error
      )
    }

    if (import.meta.env.DEV) {
      console.error('[Error Handler]', {
        type: apiError.type,
        message: apiError.message,
        statusCode: apiError.statusCode,
        timestamp: apiError.timestamp,
        originalError: apiError.originalError,
      })
    }

    if (!silent && showToast) {
      const message = customMessage || getErrorMessage(apiError)
      
      switch (apiError.type) {
        case ErrorType.VALIDATION:
          toast.warning(message)
          break
        case ErrorType.AUTHENTICATION:
        case ErrorType.AUTHORIZATION:
          toast.error(message)
          break
        case ErrorType.NETWORK:
          toast.error(message)
          break
        case ErrorType.SERVER:
          toast.error(message)
          break
        default:
          toast.error(message)
      }
    }

    return apiError
  }

  const handleApiResponse = async (response: Response): Promise<any> => {
    if (response.ok) {
      return await response.json()
    }

    let errorMessage: string
    try {
      const data = await response.json()
      errorMessage = data.message || data.error || `HTTP ${response.status}`
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`
    }

    const apiError = createApiError(response.status, errorMessage, response)
    throw apiError
  }

  return {
    handleError,
    handleApiResponse,
    createApiError,
  }
}
