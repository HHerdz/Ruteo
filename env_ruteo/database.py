from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(Path(__file__).resolve().parent / ".env")

DB_URL = os.getenv("DB_URL")

engine = create_engine(
    DB_URL,
    pool_size=10,          # conexiones permanentes en el pool
    max_overflow=20,       # conexiones extra en picos de tráfico
    pool_pre_ping=True,    # verifica conexiones muertas antes de usarlas
    pool_recycle=1800,     # recicla conexiones cada 30 min (evita timeouts de MySQL)
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()