from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterSchema(BaseModel):
    nom_usuario: Optional[str] = Field(None, max_length=100, examples=["Juan Pérez"])
    email:       EmailStr       = Field(..., examples=["juan@correo.com"])
    password:    str            = Field(..., min_length=6, examples=["miClave123"])
    rol:         str            = Field(default="usuario", examples=["usuario", "admin"])


class LoginSchema(BaseModel):
    email:    EmailStr = Field(..., examples=["juan@correo.com"])
    password: str      = Field(..., examples=["miClave123"])


class UsuarioResponse(BaseModel):
    id_usuario:  int
    nom_usuario: Optional[str]
    email:       str
    rol:         str

    class Config:
        from_attributes = True