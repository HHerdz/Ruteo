from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv   # 👈 ESTO FALTABA
import os

load_dotenv()

DB_URL = os.getenv("DB_URL")

print("DB_URL:", DB_URL)

if not DB_URL:
    raise ValueError("DB_URL no está definida")

engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()