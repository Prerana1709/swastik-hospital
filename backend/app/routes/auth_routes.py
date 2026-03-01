from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth import LoginRequest
from app.controllers import auth_controller
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(credentials: LoginRequest):
    return await auth_controller.login_user(credentials)




@router.get("/me")
async def me(user=Depends(get_current_user)):
    return {"username": user.get("sub"), "id": user.get("id")}
