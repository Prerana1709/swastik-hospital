from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.auth import LoginRequest
from app.controllers import auth_controller
from app.utils.auth import decode_token

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


@router.post("/login")
async def login(credentials: LoginRequest):
    return await auth_controller.login_user(credentials)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


@router.get("/me")
async def me(user=Depends(get_current_user)):
    return {"username": user.get("sub"), "id": user.get("id")}
