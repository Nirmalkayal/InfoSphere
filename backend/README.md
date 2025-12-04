# Turf Locks Backend

This folder contains the Express + Mongoose backend for the Turf Locks project.

Quick start:

1. Copy `.env.example` to `.env` and fill values
2. Run `npm install` then `npm run dev`

Notes:
- The app expects `ADMIN_USER`, `ADMIN_PASS`, `JWT_SECRET`, and `MONGODB_URI` in the `.env` file.
- `POST /admin/login` accepts `{ username, password }` and returns a JWT for dashboard endpoints.
- External APIs under `/api` require an `x-api-key` header (check `apiKeyAuth` middleware).
- Locking is implemented atomically by attempting to flip `Slot.status` from `available` to `locked`.

Install deps (from `backend/`):

```powershell
cd D:\CENTRALIZED_ENGINE\backend
npm install
npm run dev
```
