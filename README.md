## Lead Management System

### Project description
Lead tracking CRM with authentication, leads, activities, and an analytics dashboard. Users can register/login, create/update leads, log activities (calls, emails, meetings, notes), and view summary analytics.

### Tech stack used
- Frontend: React, TypeScript, Vite, Tailwind, Axios, Recharts
- Backend: Django, Python, JWT, CORS
- DB: PostgreSQL
- Hosting: Vercel (frontend), Render (backend)

### Setup instructions
1) Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend check at `http://localhost:8000/`.

2) Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`.

### Environment variables
1) Backend
```
SECRET_KEY=change-me
DEBUG=True

DB_ENGINE=django.db.backends.postgresql
DB_NAME=lead_management_db
DB_USER=lead_user
DB_PASSWORD=lead_password
DB_HOST=localhost
DB_PORT=5432

SIMPLE_JWT_ACCESS_MINUTES=60
SIMPLE_JWT_REFRESH_DAYS=7

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CORS_ALLOW_CREDENTIALS=True
```

2) Frontend
```
VITE_API_URL=http://localhost:8000/api
```

### Deployment URLs
- Frontend (Vercel): `https://lead-management-system-lime.vercel.app`
- Backend (Render): `https://lead-management-system-8hd6.onrender.com`

### Test credentials for demo
Use this account to sign in:
- Username: `tester`
- Password: `test12345`

### Time spent on the project
- ~ 15 hours
