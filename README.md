# Portfolio Vue Demo

> A modern Vue 3 + TypeScript application showcasing enterprise-level best practices in frontend development

A demonstration project for the portfolio of Wandy Rodríguez. This Vue 3 application showcases **best practices** in modular architecture, clean code, type safety, and integration with a RESTful API backend built in .NET 10 using Clean Architecture and SOLID principles.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue.svg)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

**🔗 Repositories:**
- **Frontend:** [Portfolio-Vue](https://github.com/Wandyrh/Portfolio-Vue)
- **Backend API:** [Clean-Architecture-Dot-Net](https://github.com/Wandyrh/Clean-Architecture-Dot-Net)

---

## 📸 Screenshots

![Users Management](https://github.com/user-attachments/assets/12cda765-0b77-44a4-8bfc-7449ac9df21d)
![Product Categories](https://github.com/user-attachments/assets/58a1e5ee-ce32-41c7-a9bd-f39c5745de51)
![Products View](https://github.com/user-attachments/assets/382f9167-583f-4206-b40e-ddfb44ce85d0)
![Login Screen](https://github.com/user-attachments/assets/1149ad96-1408-44d1-a1dd-c709d22cc088)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Environment Configuration](#-environment-configuration)
- [Development](#-development)
- [Architecture](#-architecture)
- [Internationalization](#-internationalization)
- [API Integration](#-api-integration)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

### Core Features
- ✅ **Authentication** - JWT-based login with automatic token management
- ✅ **User Management** - Complete CRUD for users with form validation
- ✅ **Product Categories** - Manage product categories
- ✅ **Products** - Full product management with category relationships
- ✅ **Responsive Design** - Mobile-first Bootstrap 5 UI
- ✅ **Real-time Validation** - VeeValidate + Yup schemas
- ✅ **Toast Notifications** - User-friendly feedback for all operations

### Developer Experience
- 🚀 **TypeScript** - Full type safety across the application
- 🎨 **Composition API** - Modern Vue 3 patterns with `<script setup>`
- 🔥 **Vite** - Lightning-fast HMR and builds
- 🌍 **i18n** - English and Spanish with instant language switching
- 📦 **Feature-Based Architecture** - Scalable and maintainable code organization
- 🎯 **Type-Safe Environment Variables** - Validated configuration with IntelliSense
- ⚡ **Loading States** - Global progress bar, spinners, and skeleton loaders
- 🔒 **Session Storage** - Secure token management

---

## 🛠️ Tech Stack

### Core Framework
- **[Vue 3.4.0](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript 5.4.0](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Vite 5.4.21](https://vitejs.dev/)** - Next-generation frontend tooling

### State Management & Routing
- **[Pinia 3.0.3](https://pinia.vuejs.org/)** - Intuitive state management
- **[Vue Router 4.5.1](https://router.vuejs.org/)** - Official router for Vue.js

### UI & Validation
- **[Bootstrap 5.3.7](https://getbootstrap.com/)** - Responsive UI framework
- **[VeeValidate 4.15.1](https://vee-validate.logaretm.com/)** - Form validation
- **[Yup 1.6.1](https://github.com/jquense/yup)** - Schema validation
- **[Vue Toastification 2.0.0-rc.5](https://vue-toastification.maronato.dev/)** - Toast notifications
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** - Icon library

### Internationalization
- **[Vue I18n 11.1.6](https://vue-i18n.intlify.dev/)** - Internationalization plugin

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest stable version

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wandyrh/Portfolio-Vue.git
   cd Portfolio-Vue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy the example file
   cp .env.example .env.development
   
   # Edit .env.development with your backend API URL
   # For local development:
   VITE_API_URL=http://localhost:5174/api/v1
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### Backend Setup

This frontend requires the backend API to be running. See the [Backend Repository](https://github.com/Wandyrh/Clean-Architecture-Dot-Net) for setup instructions.

---

## 📁 Project Structure

```
src/
├── features/              # Feature-based modules
│   ├── auth/             # Authentication
│   │   ├── services/     # API calls
│   │   ├── types/        # TypeScript types
│   │   └── views/        # Login view
│   ├── users/            # User management
│   ├── products/         # Product management
│   └── categories/       # Category management
│
├── shared/               # Shared resources
│   ├── components/       # Reusable components
│   │   ├── LoadingBar.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── SkeletonTable.vue
│   │   ├── MainLayout.vue
│   │   └── ConfirmDialog.vue
│   ├── composables/      # Composition functions
│   │   ├── useModal.ts
│   │   ├── useCrud.ts
│   │   └── useErrorHandler.ts
│   ├── stores/           # Global Pinia stores
│   │   ├── language.ts
│   │   └── loading.ts
│   ├── config/           # Configuration
│   │   └── env.ts        # Type-safe environment config
│   └── types/            # Shared TypeScript types
│
├── locales/              # i18n translations
│   ├── en.json
│   └── es.json
│
├── router/               # Vue Router configuration
│   └── index.ts
│
├── assets/               # Global assets
│   └── global.css
│
├── App.vue               # Root component
└── main.ts               # Application entry point
```

---

## 📜 Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev              # Uses .env.development (port 5173)

# Start staging environment
npm run dev:staging      # Uses .env.staging
```

### Production

```bash
# Build for production
npm run build            # Uses .env.production

# Build for staging
npm run build:staging    # Uses .env.staging

# Preview production build locally
npm run preview          # Serves the dist/ folder
```

### Other Commands

```bash
# Type check
npm run type-check       # Run TypeScript compiler check

# Lint (if configured)
npm run lint             # ESLint check
```

---

## ⚙️ Environment Configuration

This project uses a **type-safe environment variable system** with support for multiple deployment environments.

### Quick Setup

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your environment:
   ```env
   VITE_APP_ENV=development
   VITE_API_URL=http://localhost:5174/api/v1
   VITE_API_TIMEOUT=30000
   VITE_APP_NAME=Portfolio Vue
   VITE_ENABLE_DEBUG=true
   ```

### Available Environments

| Environment | File | Purpose |
|------------|------|---------|
| Development | `.env.development` | Local development with debug tools |
| Staging | `.env.staging` | Pre-production testing |
| Production | `.env.production` | Live production deployment |
| Local | `.env.local` | Local overrides (gitignored) |

### Type-Safe Access

All environment variables are validated at startup and accessible with full TypeScript support:

```typescript
import { env } from '@/shared/config/env'

// Fully typed with IntelliSense
const apiUrl = env.api.url           // string
const timeout = env.api.timeout      // number
const debug = env.features.debug     // boolean

// Environment checks
if (env.isDevelopment) {
  console.log('Running in development mode')
}
```

---

## 💻 Development

### Recommended IDE Setup

- **[VS Code](https://code.visualstudio.com/)** with the following extensions:
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 language support
  - [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## 🏛️ Architecture

This application follows a **feature-based architecture** where each business domain is self-contained with its own components, services, stores, and types.

### Key Patterns

- **Composition API**: Modern Vue 3 patterns with `<script setup>`
- **Composables**: Reusable logic extracted into composition functions
- **Type Safety**: Full TypeScript coverage with strict type checking
- **Separation of Concerns**: Clear boundaries between layers
- **Centralized State**: Pinia stores for shared state
- **Error Handling**: Unified error handling with custom error types

### Data Flow

```
┌─────────────┐
│    View     │ ← User interaction
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Store     │ ← State management (Pinia)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │ ← API communication
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backend    │ ← REST API
└─────────────┘
```

---

## 🌍 Internationalization

Full multi-language support with instant switching:

### Supported Languages
- 🇺🇸 **English** (en)
- 🇪🇸 **Spanish** (es)

### Features
- ✅ Language selector in the header
- ✅ All UI elements translated (menus, buttons, labels, messages)
- ✅ Form validation messages localized
- ✅ Toast notifications in selected language
- ✅ Persistent language selection (localStorage)
- ✅ Automatic language restoration on page load

### Usage in Components

```typescript
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Simple translation
const title = t('users.title')  // "Users" or "Usuarios"

// Translation with parameters
const message = t('users.confirmDelete', { name: 'John' })

// Change language
locale.value = 'es'
```

### Adding New Translations

1. Add keys to `src/locales/en.json`:
   ```json
   {
     "myFeature": {
       "title": "My Feature",
       "description": "Feature description"
     }
   }
   ```

2. Add same keys to `src/locales/es.json`:
   ```json
   {
     "myFeature": {
       "title": "Mi Característica",
       "description": "Descripción de la característica"
     }
   }
   ```

3. Use in components:
   ```vue
   <template>
     <h1>{{ t('myFeature.title') }}</h1>
   </template>
   ```

---

## 🔌 API Integration

### Backend API

This frontend communicates with a .NET 8 backend built with Clean Architecture.

**Backend Repository:** [Clean-Architecture-Dot-Net](https://github.com/Wandyrh/Clean-Architecture-Dot-Net)

### API Endpoints

#### Authentication
```
POST /api/v1/auth/login
```
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "firstName": "John", "lastName": "Doe" }
}
```

#### Users
```
GET    /api/v1/users           # List all users (paginated)
GET    /api/v1/users/{id}      # Get user by ID
POST   /api/v1/users           # Create new user
PUT    /api/v1/users/{id}      # Update user
DELETE /api/v1/users/{id}      # Delete user
```

#### Product Categories
```
GET    /api/v1/product-categories
POST   /api/v1/product-categories
PUT    /api/v1/product-categories/{id}
DELETE /api/v1/product-categories/{id}
```

#### Products
```
GET    /api/v1/products
POST   /api/v1/products
PUT    /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

### Service Layer

All API calls are handled through service modules:

```typescript
// Example: userService.ts
import { authFetch } from '@/features/auth/services/authFetch'
import type { UserDto, CreateUserDto } from '../types/user'

export async function getUsers(): Promise<UserDto[]> {
  const response = await authFetch('/users')
  return response.json()
}

export async function createUser(data: CreateUserDto): Promise<UserDto> {
  const response = await authFetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return response.json()
}
```

### Authentication Flow

1. User submits credentials via Login form
2. `authService.login()` calls `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in sessionStorage via `tokenService`
5. `authFetch` automatically includes token in subsequent requests
6. On 401/403 responses, user is redirected to login

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ API Connection Errors

**Problem:** `Failed to fetch` or `Network error`

**Solution:**
1. Ensure the backend API is running
2. Check `VITE_API_URL` in your `.env` file
3. Verify CORS is configured on the backend
4. Check browser console for detailed errors

```bash
# Check your environment configuration
cat .env.development

# Expected output:
# VITE_API_URL=http://localhost:5174/api/v1
```

#### ❌ Build Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

#### ❌ Environment Variables Not Working

**Problem:** `import.meta.env.VITE_*` is undefined

**Solution:**
1. Ensure variable names start with `VITE_`
2. Restart dev server after changing `.env` files
3. Check `vite-env.d.ts` has correct types
4. Use type-safe config: `import { env } from '@/shared/config/env'`

#### ❌ Authentication Issues

**Problem:** "Token expired" or redirect loops

**Solution:**
1. Clear sessionStorage: `sessionStorage.clear()`
2. Log in again
3. Check token expiry configuration in `.env`:
   ```env
   VITE_TOKEN_EXPIRY_HOURS=24
   ```

### Debug Mode

Enable debug logging in development:

```env
# .env.development
VITE_ENABLE_DEBUG=true
```

This will log:
- Environment configuration on startup
- API requests and responses
- State changes in Pinia stores

### Getting Help
- 🐛 [Report bugs](https://github.com/Wandyrh/Portfolio-Vue/issues) on GitHub
- 💬 [Ask questions](https://github.com/Wandyrh/Portfolio-Vue/discussions) in Discussions

---

## 📝 License

This project is licensed under the **MIT License**.

See the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Wandy Rodríguez**

- GitHub: [@Wandyrh](https://github.com/Wandyrh)
- Backend Repository: [Clean-Architecture-Dot-Net](https://github.com/Wandyrh/Clean-Architecture-Dot-Net)

---

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vite team for the blazing-fast build tool
- All contributors and open-source maintainers

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star! ⭐**

Made with ❤️ by [Wandy Rodríguez](https://github.com/Wandyrh)

</div>
