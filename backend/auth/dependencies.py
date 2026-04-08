from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from auth.jwt_handler import decode_token

bearer_scheme = HTTPBearer()

revoked_tokens: set = set()


def jwt_required(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Protege un endpoint con access token.
    Uso: payload: dict = Depends(jwt_required)
    """
    token = credentials.credentials

    if token in revoked_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Token revocado", "code": "token_revoked"},
        )
    try:
        payload = decode_token(token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Token inválido o expirado", "code": "authorization_required"},
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Se requiere un access token"},
        )
    return payload


def jwt_refresh_required(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Protege el endpoint /auth/refresh con refresh token.
    Uso: payload: dict = Depends(jwt_refresh_required)
    """
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Refresh token inválido o expirado"},
        )
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "Se requiere un refresh token"},
        )
    return payload


def admin_required(payload: dict = Depends(jwt_required)) -> dict:
    """
    Protege un endpoint exigiendo rol admin.
    Uso: payload: dict = Depends(admin_required)
    """
    if payload.get("rol") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": "Acceso denegado: se requiere rol admin"},
        )
    return payload
