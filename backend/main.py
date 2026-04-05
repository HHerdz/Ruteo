from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from metodos import consultarApi

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(consultarApi.router, prefix="/ruteo")