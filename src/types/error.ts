export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType
  message: string
  statusCode?: number
  originalError?: any
  timestamp: Date
}

export class ApiError extends Error {
  public type: ErrorType
  public statusCode?: number
  public originalError?: any
  public timestamp: Date

  constructor(message: string, type: ErrorType, statusCode?: number, originalError?: any) {
    super(message)
    this.name = 'ApiError'
    this.type = type
    this.statusCode = statusCode
    this.originalError = originalError
    this.timestamp = new Date()
  }
}

export function createApiError(statusCode: number, message?: string, originalError?: any): ApiError {
  let type: ErrorType
  let defaultMessage: string

  switch (statusCode) {
    case 400:
      type = ErrorType.VALIDATION
      defaultMessage = 'Invalid request data'
      break
    case 401:
      type = ErrorType.AUTHENTICATION
      defaultMessage = 'Authentication required'
      break
    case 403:
      type = ErrorType.AUTHORIZATION
      defaultMessage = 'Access denied'
      break
    case 404:
      type = ErrorType.NOT_FOUND
      defaultMessage = 'Resource not found'
      break
    case 500:
    case 502:
    case 503:
    case 504:
      type = ErrorType.SERVER
      defaultMessage = 'Server error occurred'
      break
    default:
      type = ErrorType.UNKNOWN
      defaultMessage = 'An unexpected error occurred'
  }

  return new ApiError(message || defaultMessage, type, statusCode, originalError)
}

export function isNetworkError(error: any): boolean {
  return error instanceof TypeError && error.message === 'Failed to fetch'
}
