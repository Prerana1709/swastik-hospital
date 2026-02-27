# Swastik Hospital Backend (FastAPI + MongoDB)

## Setup

### 1. Create virtual environment

```bash
cd backend
python -m venv .venv
```

**Activate:**

- **Windows:** `.venv\Scripts\activate`
- **Mac/Linux:** `source .venv/bin/activate`

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment variables

Copy `.env.example` to `.env` and set your MongoDB Atlas URI and JWT secret:

```bash
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```

Edit `.env` and set:

- `MONGO_URI` – your MongoDB Atlas connection string
- `SECRET_KEY` – a strong secret for JWT signing

### 4. Run the server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

## Folder structure

```
backend/
├── app/
│   ├── config/     # database, settings
│   ├── models/     # MongoDB document models
│   ├── schemas/    # Pydantic schemas
│   ├── routes/     # API routes
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── main.py
├── .env
├── .env.example
├── requirements.txt
└── README.md
```
