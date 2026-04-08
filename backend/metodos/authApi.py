from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from modelos.userModelo import Usuario
from esquema.userEschema import RegisterSchema, LoginSchema
from auth.jwt_handler import create_access_token, create_refresh_token
from auth.dependencies import jwt_required, jwt_refresh_required, revoked_tokens

router = APIRouter()


# ============================================
# REGISTER
# ============================================
@router.post("/register", status_code=201)
async def registrar_usuario(data: RegisterSchema, db: Session = Depends(get_db)):
    if not data.nom_user.strip() or not data.password:
        raise HTTPException(status_code=400, detail="Usuario y contraseña son requeridos")

    if db.query(Usuario).filter(Usuario.nom_user == data.nom_user).first():
        raise HTTPException(status_code=409, detail="El usuario ya existe")

    nuevo = Usuario(nom_user=data.nom_user, rol=data.rol)
    nuevo.set_password(data.password)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"mensaje": f"Usuario '{data.nom_user}' creado exitosamente"}


# ============================================
# LOGIN
# ============================================
@router.post("/login")
async def loguear_usuario(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter(Usuario.nom_user == data.nom_user).first()

    if not user or not user.check_password(data.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token  = create_access_token(identity=user.nom_user,
                                        additional_claims={"rol": user.rol})
    refresh_token = create_refresh_token(identity=user.nom_user)

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "Bearer",
        "expires_in":    900,          # 15 min en segundos
        "Usuario":       user.nom_user,
    }


# ============================================
# REFRESH
# ============================================
@router.post("/refresh")
async def renovar_token(payload: dict = Depends(jwt_refresh_required),
                        db: Session = Depends(get_db)):
    current_user = payload["sub"]
    user = db.query(Usuario).filter(Usuario.nom_user == current_user).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    new_access_token = create_access_token(
        identity=current_user,
        additional_claims={"rol": user.rol},
    )
    return {"access_token": new_access_token}


# ============================================
# LOGOUT
# ============================================
@router.delete("/logout")
async def cerrar_sesion(request: Request, payload: dict = Depends(jwt_required)):
    raw_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    revoked_tokens.add(raw_token)
    return {"mensaje": "Sesión cerrada exitosamente"}
