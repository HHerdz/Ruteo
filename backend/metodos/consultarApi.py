from database import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from modelos import modelo
from esquema.eschema import (
    CiudadSchema,
    DestinoSchema,
    HotelSchema,
    RestauranteSchema,
    ActividadSchema,
    ViajeSchema,
    ViajeroSchema
)

router = APIRouter()

# ============================================
# RAÍZ
# ============================================
@router.get("/")
async def consultar():
    return {"mensaje": "API de turismo funcionando"}


# ============================================
# CIUDADES
# ============================================
@router.get("/ciudades/all")
async def leer_ciudades(db: Session = Depends(get_db)):
    return db.query(modelo.Ciudad).all()

@router.post("/ciudades/add")
async def crear_ciudad(ciudad: CiudadSchema, db: Session = Depends(get_db)):
    nueva = modelo.Ciudad(**ciudad.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/ciudades/{id_ciudad}")
async def leer_ciudad(id_ciudad: int, db: Session = Depends(get_db)):
    ciudad = db.query(modelo.Ciudad).filter(modelo.Ciudad.id_ciudad == id_ciudad).first()
    if not ciudad:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    return ciudad

@router.put("/ciudades/update/{id_ciudad}")
async def actualizar_ciudad(id_ciudad: int, datos: CiudadSchema, db: Session = Depends(get_db)):
    ciudad = db.query(modelo.Ciudad).filter(modelo.Ciudad.id_ciudad == id_ciudad).first()
    if not ciudad:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    for key, value in datos.dict().items():
        setattr(ciudad, key, value)
    db.commit()
    db.refresh(ciudad)
    return ciudad

@router.delete("/ciudades/borrar/{id_ciudad}")
async def borrar_ciudad(id_ciudad: int, db: Session = Depends(get_db)):
    ciudad = db.query(modelo.Ciudad).filter(modelo.Ciudad.id_ciudad == id_ciudad).first()
    if not ciudad:
        raise HTTPException(status_code=404, detail="Ciudad no encontrada")
    db.delete(ciudad)
    db.commit()
    return {"mensaje": f"Ciudad {id_ciudad} eliminada"}


# ============================================
# DESTINOS
# ============================================
@router.get("/destinos/all")
async def leer_destinos(db: Session = Depends(get_db)):
    return db.query(modelo.Destino).all()

@router.post("/destinos/add")
async def crear_destino(destino: DestinoSchema, db: Session = Depends(get_db)):
    nuevo = modelo.Destino(**destino.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/destinos/{id_destino}")
async def leer_destino(id_destino: int, db: Session = Depends(get_db)):
    destino = db.query(modelo.Destino).filter(modelo.Destino.id_destino == id_destino).first()
    if not destino:
        raise HTTPException(status_code=404, detail="Destino no encontrado")
    return destino

@router.put("/destinos/update/{id_destino}")
async def actualizar_destino(id_destino: int, datos: DestinoSchema, db: Session = Depends(get_db)):
    destino = db.query(modelo.Destino).filter(modelo.Destino.id_destino == id_destino).first()
    if not destino:
        raise HTTPException(status_code=404, detail="Destino no encontrado")
    for key, value in datos.dict().items():
        setattr(destino, key, value)
    db.commit()
    db.refresh(destino)
    return destino

@router.delete("/destinos/borrar/{id_destino}")
async def borrar_destino(id_destino: int, db: Session = Depends(get_db)):
    destino = db.query(modelo.Destino).filter(modelo.Destino.id_destino == id_destino).first()
    if not destino:
        raise HTTPException(status_code=404, detail="Destino no encontrado")
    db.delete(destino)
    db.commit()
    return {"mensaje": f"Destino {id_destino} eliminado"}


# ============================================
# HOTELES
# ============================================
@router.get("/hoteles/all")
async def leer_hoteles(db: Session = Depends(get_db)):
    return db.query(modelo.Hotel).all()

@router.post("/hoteles/add")
async def crear_hotel(hotel: HotelSchema, db: Session = Depends(get_db)):
    nuevo = modelo.Hotel(**hotel.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/hoteles/{id_hotel}")
async def leer_hotel(id_hotel: int, db: Session = Depends(get_db)):
    hotel = db.query(modelo.Hotel).filter(modelo.Hotel.id_hotel == id_hotel).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    return hotel

@router.put("/hoteles/update/{id_hotel}")
async def actualizar_hotel(id_hotel: int, datos: HotelSchema, db: Session = Depends(get_db)):
    hotel = db.query(modelo.Hotel).filter(modelo.Hotel.id_hotel == id_hotel).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    for key, value in datos.dict().items():
        setattr(hotel, key, value)
    db.commit()
    db.refresh(hotel)
    return hotel

@router.delete("/hoteles/borrar/{id_hotel}")
async def borrar_hotel(id_hotel: int, db: Session = Depends(get_db)):
    hotel = db.query(modelo.Hotel).filter(modelo.Hotel.id_hotel == id_hotel).first()
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel no encontrado")
    db.delete(hotel)
    db.commit()
    return {"mensaje": f"Hotel {id_hotel} eliminado"}


# ============================================
# RESTAURANTES
# ============================================
@router.get("/restaurantes/all")
async def leer_restaurantes(db: Session = Depends(get_db)):
    return db.query(modelo.Restaurante).all()

@router.post("/restaurantes/add")
async def crear_restaurante(restaurante: RestauranteSchema, db: Session = Depends(get_db)):
    nuevo = modelo.Restaurante(**restaurante.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/restaurantes/{id_restaurante}")
async def leer_restaurante(id_restaurante: int, db: Session = Depends(get_db)):
    restaurante = db.query(modelo.Restaurante).filter(modelo.Restaurante.id_restaurante == id_restaurante).first()
    if not restaurante:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    return restaurante

@router.put("/restaurantes/update/{id_restaurante}")
async def actualizar_restaurante(id_restaurante: int, datos: RestauranteSchema, db: Session = Depends(get_db)):
    restaurante = db.query(modelo.Restaurante).filter