from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import connect_to_mongo, close_mongo
from app.controllers.auth_controller import ensure_default_user
from app.routes import auth_routes, registration_routes, report_routes, patient_record_routes, admin_routes, lab_routes, clinical_routes, billing_routes

app = FastAPI(title="Swastik Hospital API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()
    await ensure_default_user()


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo()


@app.get("/")
async def root():
    return {"message": "Swastik Hospital Backend Running"}


app.include_router(auth_routes.router)
app.include_router(registration_routes.router)
app.include_router(report_routes.router)
app.include_router(patient_record_routes.router)
app.include_router(admin_routes.router, prefix="/api/admin", tags=["Admin"])
app.include_router(lab_routes.router, prefix="/api/lab", tags=["Lab"])
app.include_router(clinical_routes.router, prefix="/api/clinical", tags=["Clinical"])
app.include_router(billing_routes.router)
