from fastapi import FastAPI, Depends
from metodos import consultarApi

app = FastAPI()
app.include_router(consultarApi.router, prefix="/ruteo")