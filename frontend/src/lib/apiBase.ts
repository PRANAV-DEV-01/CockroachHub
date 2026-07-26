// Single source of truth for the backend's base URL.
//
// Local dev: Vite proxies /api to the backend (see vite.config.ts), so the
// default "/api" works with no config.
//
// Production: the frontend (e.g. on Vercel) and backend (e.g. on Render,
// Railway, or Fly) usually live on different domains. Set VITE_API_URL in
// your frontend's environment variables to the full backend URL, e.g.
//   VITE_API_URL=https://your-api.onrender.com/api
// and redeploy. Until that's set, every API call below will fail because
// there's nothing listening at <your-frontend-domain>/api/*.
export const API_BASE: string = import.meta.env.VITE_API_URL || "/api";
