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

    # Email obligatorio y limpio
    if not data.email:
        raise HTTPException(status_code=400, detail="El email es requerido")

    # Verificar si el email ya está registrado (columna UNIQUE en BD)
    if db.query(Usuario).filter(Usuario.email == data.email).first():
        raise HTTPException(status_code=409, detail="El email ya está registrado")

    # Crear usuario con los campos de la tabla `usuarios`
    nuevo = Usuario(
        nom_usuario=data.nom_usuario,   # puede ser None
        email=data.email,
        rol=data.rol,
    )
    nuevo.set_password(data.password)   # guarda en password_hash

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return {
        "mensaje":      f"Usuario '{data.email}' creado exitosamente",
        "id_usuario":   nuevo.id_usuario,
        "nom_usuario":  nuevo.nom_usuario,
        "rol":          nuevo.rol,
    }


# ============================================
# LOGIN  (identificador: email)
# ============================================
@router.post("/login")
async def loguear_usuario(data: LoginSchema, db: Session = Depends(get_db)):

    # Buscar por email (único en la tabla)
    user = db.query(Usuario).filter(Usuario.email == data.email).first()

    if not user or not user.check_password(data.password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    # El "sub" del token lleva el email para identificar al usuario
    access_token  = create_access_token(
        identity=user.email,
        additional_claims={"rol": user.rol},
    )
    refresh_token = create_refresh_token(identity=user.email)

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "Bearer",
        "expires_in":    900,               # 15 min en segundos
        "email":         user.email,
        "nom_usuario":   user.nom_usuario,
        "rol":           user.rol,
    }


# ============================================
# REFRESH
# ============================================
@router.post("/refresh")
async def renovar_token(
    payload: dict = Depends(jwt_refresh_required),
    db: Session   = Depends(get_db),
):
    current_email = payload["sub"]              
    user = db.query(Usuario).filter(Usuario.email == current_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    new_access_token = create_access_token(
        identity=current_email,
        additional_claims={"rol": user.rol},
    )
    return {"access_token": new_access_token}


# ============================================
# LOGOUT
# ============================================
@router.delete("/logout")
async def cerrar_sesion(
    request: Request,
    payload: dict = Depends(jwt_required),
):
    raw_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    revoked_tokens.add(raw_token)
    return {"mensaje": "Sesión cerrada exitosamente"}