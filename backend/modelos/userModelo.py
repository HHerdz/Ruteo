from sqlalchemy import Column, Integer, String
from database import Base
import bcrypt

class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario    = Column(Integer, primary_key=True, autoincrement=True)
    nom_usuario   = Column(String(100), nullable=True)
    email         = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol           = Column(String(20), default="usuario")

    def set_password(self, plain: str) -> None:
        hashed = bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt())
        self.password_hash = hashed.decode("utf-8")

    def check_password(self, plain: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), self.password_hash.encode("utf-8"))