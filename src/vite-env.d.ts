/// <reference types="vite/client" />

/**
 * Type definitions for environment variables
 * These must match the variables defined in .env files
 */
interface ImportMetaEnv {
  // Environment
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  
  // API Configuration
  readonly VITE_API_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // Application Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  
  // Feature Flags
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_MOCK_DATA: string
  
  // Authentication
  readonly VITE_TOKEN_STORAGE_KEY: string
  readonly VITE_TOKEN_EXPIRY_HOURS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
