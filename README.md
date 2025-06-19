# Portfolio Vue Demo

A demonstration project for the portfolio of Wandy Rodríguez. This Vue 3 application showcases best practices in modular architecture, clean code, and integration with a RESTful API backend built in .NET 8 using Clean Architecture and SOLID principles.

- **Frontend Repository:** [Portfolio-Vue](https://github.com/Wandyrh/Portfolio-Vue)
- **Backend API Repository:** [Clean-Architecture-Dot-Net](https://github.com/Wandyrh/Clean-Architecture-Dot-Net)

---

## Technologies Used

- Vue 3 (Composition API, Single File Components)
- TypeScript
- Vue Router (routing and navigation)
- Pinia (state management)
- Bootstrap 5 (UI and layout)
- i18n (vue-i18n for translations)
- JWT (authentication)
- CSS (custom styles)
- Icons: Bootstrap Icons

---

## Project Architecture

- **Feature-based structure:** Each domain (users, products, product-categories, auth) is organized in its own folder under `src/`.
- **Services:** For API communication and business logic.
- **DTOs:** TypeScript interfaces for type safety and API integration.
- **Dialogs & Forms:** For CRUD operations using Vue components and Bootstrap modals.
- **Routing:** Configured in `src/router/index.ts`.
- **Environment configuration:** API URL and other settings in `.env`.

---

## Main Libraries

- vue-router
- pinia
- bootstrap
- vue-i18n
- bootstrap-icons

---

## API Endpoints Used

The app communicates with a backend API. Main endpoints:

- **Authentication:** `POST /api/auth/login`
- **Users:** `GET /api/users`, `POST /api/users`, `PUT /api/users/{id}`, `DELETE /api/users/{id}`
- **Product Categories:** `GET /api/product-categories`, `POST /api/product-categories`, `PUT /api/product-categories/{id}`, `DELETE /api/product-categories/{id}`
- **Products:** `GET /api/products`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}`

For full API details, see the backend repository: [Clean Architecture .NET API](https://github.com/Wandyrh/Clean-Architecture-Dot-Net)

---

## Environment Configuration

Set your API base URL and other environment variables in the `.env` file:

```env
VUE_APP_API_URL=https://your-api-url.com
```

---

## Setup & Installation

Clone the repository:

```bash
git clone https://github.com/Wandyrh/Portfolio-Vue.git
cd Portfolio-Vue
```

Install dependencies:

```bash
npm install
```

Configure environment:

- Edit `.env` and set `VUE_APP_API_URL` to your backend API.

Run the app:

```bash
npm run dev
```

Access the app:

- Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Features

- **Authentication:** Login with backend validation (JWT).
- **User Management:** CRUD for users.
- **Product Categories:** CRUD for product categories.
- **Products:** CRUD for products, with category selection.
- **Responsive UI:** Bootstrap-based, mobile-friendly.
- **Dialogs:** Bootstrap modals for create/edit forms.
- **Pagination:** Server-side pagination for lists.
- **Validation:** All forms with required field validation.

---

## Internationalization (i18n)

- Full support for English and Spanish throughout the application.
- Language selector available in the header, with instant language switching.
- All menus, views, forms, dialogs, alerts, and confirmation messages are translated.
- The selected language is saved in localStorage and automatically restored on page reload.
- Translation files:
    - `src/locales/en.json`
    - `src/locales/es.json`

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Author

Wandy Rodríguez
[https://github.com/Wandyrh](https://github.com/Wandyrh)

---

## License

This project is licensed under the MIT License.
