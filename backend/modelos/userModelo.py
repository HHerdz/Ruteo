from sqlalchemy import Column, Integer, String
from passlib.context import CryptContext
from database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nom_user   = Column(String(50), unique=True, nullable=False)
    password   = Column(String(255), nullable=False)
    rol        = Column(String(15), nullable=False, default="user")

    def set_password(self, plain: str):
        self.password = pwd_context.hash(plain)

    def check_password(self, plain: str) -> bool:
        return pwd_context.verify(plain, self.password)

    def to_dict(self):
        return {
            "id_usuario": self.id_usuario,
            "nom_user":   self.nom_user,
            "rol":        self.rol,
        }
