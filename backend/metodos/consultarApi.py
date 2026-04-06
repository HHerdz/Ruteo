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
    restaurante = db.query(modelo.Restaurante).filter(modelo.Restaurante.id_restaurante == id_restaurante).first()
    if not restaurante:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    for key, value in datos.dict().items():
        setattr(restaurante, key, value)
    db.commit()
    db.refresh(restaurante)
    return restaurante

@router.delete("/restaurantes/borrar/{id_restaurante}")
async def borrar_restaurante(id_restaurante: int, db: Session = Depends(get_db)):
    restaurante = db.query(modelo.Restaurante).filter(modelo.Restaurante.id_restaurante == id_restaurante).first()
    if not restaurante:
        raise HTTPException(status_code=404, detail="Restaurante no encontrado")
    db.delete(restaurante)
    db.commit()
    return {"mensaje": f"Restaurante {id_restaurante} eliminado"}

# ============================================
# ACTIVIDADES
# ============================================
@router.get("/actividades/all")
async def leer_actividades(db: Session = Depends(get_db)):
    return db.query(modelo.Actividad).all()

@router.post("/actividades/add")
async def crear_actividad(actividad: ActividadSchema, db: Session = Depends(get_db)):
    nueva = modelo.Actividad(**actividad.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/actividades/{id_actividad}")
async def leer_actividad(id_actividad: int, db: Session = Depends(get_db)):
    actividad = db.query(modelo.Actividad).filter(modelo.Actividad.id_actividad == id_actividad).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return actividad

@router.put("/actividades/update/{id_actividad}")
async def actualizar_actividad(id_actividad: int, datos: ActividadSchema, db: Session = Depends(get_db)):
    actividad = db.query(modelo.Actividad).filter(modelo.Actividad.id_actividad == id_actividad).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    for key, value in datos.dict().items():
        setattr(actividad, key, value)
    db.commit()
    db.refresh(actividad)
    return actividad

@router.delete("/actividades/borrar/{id_actividad}")
async def borrar_actividad(id_actividad: int, db: Session = Depends(get_db)):
    actividad = db.query(modelo.Actividad).filter(modelo.Actividad.id_actividad == id_actividad).first()
    if not actividad:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    db.delete(actividad)
    db.commit()
    return {"mensaje": f"Actividad {id_actividad} eliminada"}

# ============================================
# TEMPORADAS
# ============================================
@router.get("/temporadas/all")
async def leer_temporadas(db: Session = Depends(get_db)):
    return db.query(modelo.Temporada).all()

# ============================================
# TIPS
# ============================================
@router.get("/tips/all")
async def leer_tips(db: Session = Depends(get_db)):
    return db.query(modelo.Tip).all()

# ============================================
# ITEMS
# ============================================
@router.get("/items/all")
async def leer_items(db: Session = Depends(get_db)):
    return db.query(modelo.Item).all()

# ============================================
# VIAJES
# ============================================
@router.get("/viajes/all")
async def leer_viajes(db: Session = Depends(get_db)):
    return db.query(modelo.Viaje).all()

@router.post("/viajes/add")
async def crear_viaje(viaje: ViajeSchema, db: Session = Depends(get_db)):
    nuevo = modelo.Viaje(**viaje.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.delete("/viajes/borrar/{id_viaje}")
async def borrar_viaje(id_viaje: int, db: Session = Depends(get_db)):
    viaje = db.query(modelo.Viaje).filter(modelo.Viaje.id_viaje == id_viaje).first()
    if not viaje:
        raise HTTPException(status_code=404, detail="Viaje no encontrado")
    db.delete(viaje)
    db.commit()
    return {"mensaje": f"Viaje {id_viaje} eliminado"}

# ============================================
# VIAJEROS
# ============================================
@router.get("/viajeros/all")
async def leer_viajeros(db: Session = Depends(get_db)):
    return db.query(modelo.Viajero).all()

@router.post("/viajeros/add")
async def crear_viajero(viajero: ViajeroSchema, db: Session = Depends(get_db)):
    nuevo = modelo.Viajero(**viajero.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.delete("/viajeros/borrar/{id_viajero}")
async def borrar_viajero(id_viajero: int, db: Session = Depends(get_db)):
    viajero = db.query(modelo.Viajero).filter(modelo.Viajero.id_viajero == id_viajero).first()
    if not viajero:
        raise HTTPException(status_code=404, detail="Viajero no encontrado")
    db.delete(viajero)
    db.commit()
    return {"mensaje": f"Viajero {id_viajero} eliminado"}