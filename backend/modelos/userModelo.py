from sqlalchemy import Column, Integer, String
from passlib.context import CryptContext
from database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario    = Column(Integer, primary_key=True, index=True)
    nom_usuario   = Column(String(100), nullable=True)
    email         = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol           = Column(String(20), nullable=False, default="usuario")

    def set_password(self, plain: str):
        self.password_hash = pwd_context.hash(plain)

    def check_password(self, plain: str) -> bool:
        return pwd_context.verify(plain, self.password_hash)

    def to_dict(self):
        return {
            "id_usuario":  self.id_usuario,
            "nom_usuario": self.nom_usuario,
            "email":       self.email,
            "rol":         self.rol,
        }