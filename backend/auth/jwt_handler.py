import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from dotenv import load_dotenv
from jose import jwt

load_dotenv()

SECRET_KEY  = os.getenv("JWT_SECRET_KEY", "cambia-esto-en-produccion")
ALGORITHM   = "HS256"
ACCESS_EXP  = 15 
REFRESH_EXP = 30 


def create_access_token(identity: str, additional_claims: Optional[dict] = None) -> str:
    payload = {
        "sub":  identity,
        "type": "access",
        "exp":  datetime.now(timezone.utc) + timedelta(minutes=ACCESS_EXP),
        "iat":  datetime.now(timezone.utc),
    }
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(identity: str) -> str:
    payload = {
        "sub":  identity,
        "type": "refresh",
        "exp":  datetime.now(timezone.utc) + timedelta(days=REFRESH_EXP),
        "iat":  datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
