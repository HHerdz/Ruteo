from pydantic import BaseModel

class RegisterSchema(BaseModel):
    nom_user: str
    password: str
    rol: str = "user"
    class Config:
        from_attributes = True

class LoginSchema(BaseModel):
    nom_user: str
    password: str
    class Config:
        from_attributes = True
