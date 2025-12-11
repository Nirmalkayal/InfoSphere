## 1. High-Level Overview

The project is a **MERN Stack** (MongoDB, Express, React, Node.js) application designed for managing turf venues. It consists of two main parts:

*   **Backend (`DB_ENGINE/backend`)**: A Node.js/Express REST API that handles data persistence, authentication, and business logic.
*   **Frontend (`DB_ENGINE/turfhub-dashboard`)**: A React (Vite) single-page application that provides the admin dashboard interface.

## 2. Directory Structure

### Root: `/Users/naresh/Turf Engine/DB_ENGINE`

```
DB_ENGINE/
├── backend/                  # Server-side application
│   ├── src/
│   │   ├── config/           # DB and Env configuration
│   │   ├── controllers/      # Request handlers (Logic)
│   │   ├── middleware/       # Auth checks (jwtAuth, roleCheck)
│   │   ├── models/           # Mongoose Schemas (Data Layer)
│   │   ├── routes/           # API Route definitions
│   │   └── services/         # Business logic (Webhooks, etc.)
│   ├── server.js             # Entry point
│   └── package.json
│
└── turfhub-dashboard/        # Client-side application
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── contexts/         # Global state (Auth, Socket)
    │   ├── pages/            # Main application views/routes
    │   ├── services/         # API clients & Mock Data
    │   └── lib/              # Utilities
    ├── index.html
    └── package.json
```

## 3. Backend Architecture

The backend follows a standard **MVC (Model-View-Controller)** pattern.

*   **Entry Point**: `server.js` initializes the server, while `src/app.js` sets up Express, DB connection, and Middleware.
*   **Route Partitioning**:
    *   `/admin`: Internal routes for the Dashboard (Login, Stats, Management). protected by **JWT**.
    *   `/api`: External facing routes (Webhooks, Integrations).
*   **Key Components**:
    *   **Controllers (`src/controllers`)**: `adminController`, `staffController`, `paymentController`, etc. cover specific domains.
    *   **Middleware (`src/middleware`)**: 
        *   `jwtAuth`: Verifies tokens for admin routes.
        *   `roleCheck`: Enforces Role-Based Access Control (Admin vs Manager).

**Data Flow (Backend):**
`Client Request` -> `app.js (Route Prefix)` -> `Route Definition` -> `Middleware (Auth/Role)` -> `Controller` -> `Model (Mongoose)` -> `MongoDB`

## 4. Frontend Architecture

The frontend is a modern **React** application built with **Vite** and **Tailwind CSS**.

*   **Routing**: Uses `react-router-dom`. Routes are defined in `App.tsx`.
*   **Pages (`src/pages`)**:
    *   **Core**: `Dashboard`, `Login`, `Settings`.
    *   **Management**: `Turfs` (Venues), `Staff` (Users/Shifts), `Users` (Customers).
    *   **Business**: `Calendar` (Bookings), `Analytics`, `Marketing` (Coupons), `PricingSettings`, `ApiKeys`.
*   **Services (`src/services`)**:
    *   **Hybrid Data Approach**: The application is designed to be resilient.
    *   `api.ts`: Configures Axios instances (`adminApi`).
    *   **Mock Fallback**: A custom interceptor checks if the backend is reachable or if `Vite_USE_MOCK` is true. If the backend fails, it seamlessly serves data from `mockData.ts`, allowing the UI to function for demos/development without a running server.

**Data Flow (Frontend):**
`User Action` -> `Page Component` -> `Service (api.ts)` -> `Interceptor (Check Mode)` -> 
    (A) `Real Backend API` (if connected)
    (B) `Mock Data` (if disconnected/demo mode)

## 5. Key Features & Flows

### A. Authentication
1.  User submits credentials on `Login.tsx`.
2.  Request sent to `/admin/login`.
3.  On success, JWT is stored in `localStorage`.
4.  `AuthContext` updates processing boolean and navigates to `/`.

### B. Business Operations
*   **Booking**: `Calendar.tsx` fetches slots from `/admin/slots`.
*   **Financial**: `Analytics.tsx` and `Expenses` visualize revenue vs costs.
*   **Access Control**: `ApiKeys.tsx` allows admins to generate keys for third-party integrations (Sportify, Playo).

### C. Role-Based Access
*   Certain routes (like creating API keys or financial settings) are restricted to `admin` role, enforced by both UI logic and Backend middleware.
