# CockroachHub

Emergency resource hub for student protesters in India — legal aid, live field updates, Know Your Rights, fact checking. Zero data collection. Offline-ready PWA.

## Stack

- **Frontend**: React 19 + Vite 6 + Tailwind 3 + PWA (vite-plugin-pwa)
- **Backend**: FastAPI + SQLAlchemy async + PostgreSQL 17
- **Auth**: JWT (jose) + bcrypt, 30-day expiry, jti blacklist

## Project Structure

```
CockroachHub/
├── vercel.json              # Vercel deployment config (monorepo)
├── docker-compose.yml       # PostgreSQL 17 for local dev
├── deploy.sh                # Server deployment script
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI lifespan (seed + sync)
│   │   ├── config.py        # Pydantic settings from .env
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── auth.py          # JWT + bcrypt + token blacklist
│   │   ├── seed.py          # Initial data seed
│   │   └── routers/         # auth.py, public.py, admin.py
│   ├── pyproject.toml       # Python dependencies (uv)
│   └── .env.example         # Backend env template
├── frontend/
│   ├── src/
│   │   ├── pages/           # 16 public pages + 11 admin pages
│   │   ├── components/      # UI kit + layout
│   │   ├── hooks/           # useTheme, useAutoErase, useStealth, etc.
│   │   ├── store/           # Zustand auth store
│   │   ├── lib/api.ts       # Axios with JWT interceptor + VITE_API_URL
│   │   └── data/            # Offline fallback JSON
│   ├── vite.config.ts       # PWA, sitemap, proxy
│   └── package.json         # Frontend dependencies
```

## Deploy to Vercel (Frontend)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo `PRANAV-DEV-01/CockroachHub`
4. Vercel will auto-detect the config from `vercel.json`
5. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
6. Deploy

## Deploy Backend (Render/Railway/Fly)

1. Create a PostgreSQL database (Render Managed DB, Railway, or Supabase)
2. Deploy the `backend/` directory as a web service
3. Set environment variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `SECRET_KEY` = generate with `openssl rand -hex 32`
   - `ADMIN_EMAIL` = your admin email
   - `ADMIN_PASSWORD` = a strong password
   - `ADMIN_NAME` = Super Admin
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app,http://localhost:5173`

## Local Development

```bash
# Start PostgreSQL
docker compose up -d

# Backend
cd backend
cp .env.example .env   # edit with your values
uv sync
uv run uvicorn app.main:app --reload --port 8228

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Default Admin

Created on first backend start via `ADMIN_PASSWORD` env var.

## License

Built by Cockroach Janta Party.
