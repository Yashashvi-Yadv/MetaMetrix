# MetaMetrix

A comprehensive analytics platform built with microservices architecture, combining React for the frontend with Node.js and Django backend services. The platform provides data upload, authentication, analytics processing, and visualization capabilities through a modular service-oriented design.

## Architecture Overview

The application uses a microservices architecture with the following components:

- Frontend: React + Vite application for user interface
- API Gateway: Node.js service that routes requests to appropriate microservices
- Microservices:
  - Authentication Service (Node.js): Handles user authentication and Google OAuth
  - Data Upload Service (Node.js): Manages file uploads and storage
  - Analytics Service (Node.js): Processes data and generates charts
  - Reports Service (Django): Handles report generation and advanced analytics

## Repo Layout

Top-level folders:

- `client/` — Vite + React frontend
- `server/` — contains microservices grouped under `gateway/` and `services/`
  - `gateway/` — HTTP proxy / gateway for routing requests to services
  - `services/authentication-service/` — user auth and Google auth controllers
  - `services/analytic_service/` — analytics endpoints and chart controllers
  - `services/dataupload-service/` — endpoints to upload/process CSV or other files
  - `services/metametrix_analytics/` — Django service for advanced analytics and reporting
    - `reports_service/` — Django app for report generation
    - `metametrix_analytics/` — Django project settings and config
- `shared_storage/` — shared uploads and processed output used by services
  - `Uploads/` — raw uploaded files
  - `Processed/` — generated reports and analysis outputs

## Quick prerequisites

- Node.js (v16+ recommended)
- npm (or pnpm/yarn) available on PATH
- Python 3.8+ with pip and virtualenv
- A running MongoDB instance (or a connection string for a hosted DB)
- Docker & Docker Compose (optional but recommended for local full-stack runs)

Optional (recommended for caching/performance):

- Redis (can run in Docker via docker-compose)

For the Django Reports Service:

- Python dependencies: See `server/services/metametrix_analytics/requirements.txt`
- PostgreSQL (recommended) or SQLite for development

## Environment (.env)

Each service expects its own `.env` file in the service directory (or environment variables set in your process). Example variables used across services (adjust names/values per service):

Common variables

- PORT — port the service listens on (e.g. `5001`)
- MONGO_URI — MongoDB connection string
- JWT_SECRET — secret used to sign JWTs
- STORAGE_PATH — path to `shared_storage/Uploads` or processed output

Gateway / client related

- GATEWAY_PORT — port for the gateway (e.g. `8080`)
- CLIENT_PORT — Vite dev server port (default: `5173`)

Authentication service (example `.env`)

- PORT=5002
- MONGO_URI=mongodb://localhost:27017/metametrix-auth
- JWT_SECRET=replace_with_secure_secret

Analytic service (example `.env`)

- PORT=5001
- MONGO_URI=mongodb://localhost:27017/metametrix-analytics
- JWT_SECRET=replace_with_secure_secret
- STORAGE_PATH=../../shared_storage/Processed

Data upload service (example `.env`)

- PORT=5003
- MONGO_URI=mongodb://localhost:27017/metametrix-uploads
- STORAGE_PATH=../../shared_storage/Uploads

Gateway (example `.env`)

- PORT=8080
- AUTH_SERVICE_URL=http://localhost:5002
- ANALYTIC_SERVICE_URL=http://localhost:5001
- DATAUPLOAD_SERVICE_URL=http://localhost:5003
- REPORTS_SERVICE_URL=http://localhost:8000

Django Reports Service (example `.env`)

- DEBUG=True
- SECRET_KEY=your-django-secret-key
- ALLOWED_HOSTS=localhost,127.0.0.1
- DATABASE_URL=postgresql://user:pass@localhost/metametrix_reports
- JWT_SECRET=same-as-other-services # Must match authentication service
- CORS_ALLOWED_ORIGINS=http://localhost:5173
- STORAGE_PATH=../../shared_storage/Processed

Note: The exact variable names used by each service may differ slightly. Check the `config/` files (e.g. `connectdb.js`) and Django settings in each service to confirm the variable names, or set them as process environment variables when starting the service.

## Running the app locally

There are two recommended ways to run the system locally:

1. Quick: use the provided Docker Compose (recommended)

If you prefer one-command local setup that brings up MongoDB and all services, use the included `docker-compose.yml` at the repository root.

```powershell
# from repo root (d:\Projects\MetaMetrix)
docker-compose up --build
```

This will build the service images and start:

- MongoDB (27017)
- authentication-service (5002)
- analytic_service (5001)
- dataupload-service (5003)
- gateway (8080)
- client (5173)

Check logs for a service:

```powershell
docker-compose logs -f gateway
```

2. Manual (service-by-service)

If you prefer to run services individually during development, start each service in a separate terminal. Example commands assume you're at the repo root (`d:\Projects\MetaMetrix`):

- Gateway

  - cd `server/gateway`
  - npm install
  - copy or create `.env` with gateway variables (see above)
  - npm start

- Authentication service

  - cd `server/services/authentication-service`
  - npm install
  - copy/create `.env` with auth variables
  - npm start

- Analytic service

  - cd `server/services/analytic_service`
  - npm install
  - copy/create `.env` with analytic variables
  - npm start

- Data upload service

  - cd `server/services/dataupload-service`
  - npm install
  - copy/create `.env` with upload variables
  - npm start

- Client
  - cd `client`
  - npm install
  - create `.env` if you need to point to the gateway (e.g. `VITE_API_BASE_URL=http://localhost:8080`)
  - npm run dev

The client will call the gateway to reach backend services. When running manually, ensure ports in `.env` files match the ports your services use.

## APIs overview

The project uses a gateway to forward requests to service-specific endpoints. Below are common endpoints you can expect to find in each service (adjust paths to match your service route implementations):

- Authentication service (example)

  - POST /api/auth/signin — sign in with credentials
  - POST /api/auth/google — sign in / register via Google
  - GET /api/user/me — returns current user (requires Authorization: Bearer <token>)

- Data upload service (example)

  - POST /api/data/upload — multipart file upload (CSV, etc.)
  - GET /api/data/files — list uploaded files
  - GET /api/data/files/:id/download — download uploaded file

- Analytic service (example)

  - POST /api/analytics/run — run an analysis job against uploaded data
  - GET /api/analytics/reports — list generated reports
  - GET /api/analytics/reports/:id — get a specific report

- Django Reports Service (example)
  - POST /api/reports/generate — generate comprehensive analytics report
  - GET /api/reports/templates — list available report templates
  - GET /api/reports/{id}/download — download generated report
  - GET /api/reports/metrics — get aggregated metrics
  - POST /api/reports/custom — create custom report with specific parameters

Gateway routes are typically mounted under `/api/*` and proxied to the appropriate service. Check `server/gateway/index.js` for the concrete proxy rules.

### Django Service Setup Notes

The Django Reports Service requires additional setup for development:

1. Database setup

```bash
cd server/services/metametrix_analytics
python manage.py makemigrations
python manage.py migrate
```

2. Create a superuser (optional, for admin access)

```bash
python manage.py createsuperuser
```

3. Access points

- Admin interface: http://localhost:8000/admin/
- API endpoints: http://localhost:8000/api/reports/
- Swagger docs: http://localhost:8000/api/schema/swagger-ui/

4. Running tests

```bash
python manage.py test
```

## Caching and performance

To improve responsiveness and lower load on backend services, consider these caching strategies:

- Gateway / HTTP caching

  - Add short-lived HTTP cache headers for responses that are safe to cache (example: GET reports listing).
  - Use a reverse-proxy cache (Varnish) or API gateway middleware that supports caching.

- Redis / in-memory cache

  - Use Redis to cache frequently requested items (lists, report metadata, small processed results).
  - Store derived results with sensible TTLs (e.g. 5–60 minutes depending on volatility).
  - Example use cases: caching authenticated user session lookups, caching analytics query results for repeated requests.

- Service-level caching

  - Each service can implement a local in-process cache (like LRU cache) for very hot, low-memory items.
  - Use Redis for cross-instance caching in production.

- CDN / static assets
  - Serve static/report assets and client build output from a CDN or object storage (S3) for large-scale deployments.

Example: Add Redis to docker-compose (quick sketch)

```yaml
services:
  redis:
    image: redis:7
    ports:
      - "6379:6379"

  # other services...
```

Then in a service (Node.js) you can use `ioredis` or `redis` client to set/get cached keys with TTL.

Design notes / best practices

- Cache invalidation: prefer TTLs and versioned keys (e.g. `reports:v1:user:123`) over complex invalidation logic.
- Keep caches small for in-process caches and use Redis for larger shared caches.
- Protect sensitive data: never cache PII or secrets without proper encryption and access controls.

## How sensitive data is managed

- Environment variables: Secrets like `JWT_SECRET` and DB credentials must never be committed. Keep them in `.env` files that are ignored by Git (see `.gitignore`).
- Shared storage: `shared_storage/Uploads` and `shared_storage/Processed` contain user-uploaded data and processed outputs; treat these as non-versioned artifacts and do not commit them.

## Development tips & troubleshooting

- If a service fails to start due to DB connectivity, verify `MONGO_URI` and ensure MongoDB is running.
- If calls are failing / 502 from the gateway, confirm the gateway has the correct service URLs and ports in its `.env`.
- For front-end proxy issues, set `VITE_API_BASE_URL` (or similar) to point to your gateway URL.

## License

See `LICENSE` in the repository root.
