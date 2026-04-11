# WorldWise

  WorldWise is a React app for tracking and remembering cities you have visited. It provides a simple user login/registration flow, a protected app area for managing visited cities, and localStorage-based persistence for both authentication and travel data.

## Key Features

- Login and registration using localStorage
- Protected route for the main app dashboard
- Add, view, and delete city entries
- City details page with travel notes and a Wikipedia link
- Responsive navigation across homepage, product, pricing, and app sections
- Local image assets served from the `public/` directory

## How it works

- Authentication is managed in `src/contexts/FakeAuthContext.jsx` using localStorage to save registered users and the current auth session.
- City data is stored locally in `src/contexts/CityContext.jsx` using localStorage under `worldwise_cities`.
- The app is built with React Router for page navigation and client-side routing.

## Project structure

- `public/`
  - Static assets such as `logo.png`, `bg.jpg`, `img-1.jpg`, and `img-2.jpg`
- `src/`
  - `App.jsx` — application router and provider wiring
  - `main.jsx` — app entry point
  - `components/` — reusable UI components like `Login`, `Logo`, `User`, `Sidebar`, and city list items
  - `contexts/` — React context providers for authentication and city data
  - `pages/` — page-level components such as `Homepage`, `Pricing`, `Product`, and `ProtectedRoute`
  - `hooks/` — custom hooks like geolocation and URL position parsing
  - `lib/` — helper utilities (legacy Supabase helper may still exist but current city persistence is localStorage)

## Getting started

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open the app at the local Vite development URL displayed in the terminal.

## Notes

- No external backend is required; the app uses localStorage for persistence.
- When testing in a browser, localStorage keeps users and cities between refreshes.
- If you want to reset the app data, clear your browser site data or remove the `worldwise_users`, `worldwise_auth_user`, and `worldwise_cities` keys from localStorage.

<img width="1300" height="694" alt="image" src="https://github.com/user-attachments/assets/8ef8d49a-4cb8-435f-b873-bd4746402648" />
<img width="1300" height="694" alt="Screenshot from 2026-04-11 13-37-08" src="https://github.com/user-attachments/assets/3e5b2e42-7cda-49c4-8208-1d37ebe4f786" />
