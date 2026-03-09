/**
 * Environment configuration validation and type-safe access
 * 
 * This module validates required environment variables and provides
 * type-safe access to configuration values.
 */

/**
 * Parsed and validated environment configuration
 */
export interface EnvConfig {
  // Environment
  env: 'development' | 'staging' | 'production'
  isDevelopment: boolean
  isProduction: boolean
  isStaging: boolean
  
  // API Configuration
  api: {
    url: string
    timeout: number
  }
  
  // Application Configuration
  app: {
    name: string
    version: string
  }
  
  // Feature Flags
  features: {
    debug: boolean
    mockData: boolean
  }
  
  // Authentication
  auth: {
    tokenStorageKey: string
    tokenExpiryHours: number
  }
}

/**
 * List of required environment variables
 */
const REQUIRED_ENV_VARS = [
  'VITE_API_URL',
  'VITE_APP_NAME'
] as const

/**
 * Validate that required environment variables are present
 * @throws Error if any required variable is missing
 */
function validateRequiredEnvVars(): void {
  const missing: string[] = []
  
  for (const varName of REQUIRED_ENV_VARS) {
    if (!import.meta.env[varName]) {
      missing.push(varName)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please check your .env file or create one from .env.example`
    )
  }
}

/**
 * Parse a string to boolean
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === '') return defaultValue
  return value.toLowerCase() === 'true'
}

/**
 * Parse a string to number
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value === undefined || value === '') return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Get the current environment
 */
function getEnvironment(): 'development' | 'staging' | 'production' {
  const env = import.meta.env.VITE_APP_ENV
  
  if (env === 'staging' || env === 'production') {
    return env
  }
  
  return 'development'
}

/**
 * Load and validate environment configuration
 * @throws Error if validation fails
 */
function loadEnvConfig(): EnvConfig {
  // Validate required variables first
  validateRequiredEnvVars()
  
  const env = getEnvironment()
  
  return {
    // Environment
    env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isStaging: env === 'staging',
    
    // API Configuration
    api: {
      url: import.meta.env.VITE_API_URL,
      timeout: parseNumber(import.meta.env.VITE_API_TIMEOUT, 30000)
    },
    
    // Application Configuration
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Portfolio Vue',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0'
    },
    
    // Feature Flags
    features: {
      debug: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG, false),
      mockData: parseBoolean(import.meta.env.VITE_ENABLE_MOCK_DATA, false)
    },
    
    // Authentication
    auth: {
      tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'auth_token',
      tokenExpiryHours: parseNumber(import.meta.env.VITE_TOKEN_EXPIRY_HOURS, 24)
    }
  }
}

/**
 * Validated and type-safe environment configuration
 * 
 * This is initialized once when the module is imported and cached.
 * All environment variables are validated at startup.
 * 
 * @example
 * ```ts
 * import { env } from '@/shared/config/env'
 * 
 * // Type-safe access
 * const apiUrl = env.api.url
 * const isDebug = env.features.debug
 * 
 * if (env.isDevelopment) {
 *   console.log('Running in development mode')
 * }
 * ```
 */
export const env: EnvConfig = loadEnvConfig()

/**
 * Log environment configuration (only in development)
 */
if (env.isDevelopment && env.features.debug) {
  console.log('🔧 Environment Configuration:', {
    environment: env.env,
    apiUrl: env.api.url,
    appName: env.app.name,
    version: env.app.version,
    features: env.features
  })
}
