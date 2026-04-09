from pydantic import BaseModel
from typing import Optional

class RegisterSchema(BaseModel):
    nom_usuario: Optional[str] = None
    email:       str
    password:    str
    rol:         str = "usuario"
    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    email:    str
    password: str
    class Config:
        from_attributes = True