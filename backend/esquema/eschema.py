from pydantic import BaseModel
from typing import Optional
from datetime import date

class CiudadSchema(BaseModel):
    nom_ciudad: str
    departamento: str
    class Config:
        from_attributes = True

class DestinoSchema(BaseModel):
    nom_destino: str
    descripcion: Optional[str]
    id_ciudad: int
    tipo_destino: str
    imagen_url: Optional[str]
    latitud: Optional[float]
    longitud: Optional[float]
    activo: Optional[bool] = True
    class Config:
        from_attributes = True

class HotelSchema(BaseModel):
    id_destino: int
    nom_hotel: str
    descripcion: Optional[str]
    categoria: str
    estrellas: Optional[int]
    precio_noche: int
    direccion: Optional[str]
    telefono: Optional[str]
    sitio_web: Optional[str]
    latitud: Optional[float]
    longitud: Optional[float]
    activo: Optional[bool] = True
    class Config:
        from_attributes = True

class RestauranteSchema(BaseModel):
    id_destino: int
    nom_restaurante: str
    descripcion: Optional[str]
    tipo_cocina: Optional[str]
    categoria: str
    precio_promedio: int
    direccion: Optional[str]
    telefono: Optional[str]
    horario: Optional[str]
    latitud: Optional[float]
    longitud: Optional[float]
    activo: Optional[bool] = True
    class Config:
        from_attributes = True

class ActividadSchema(BaseModel):
    id_destino: int
    nom_actividad: str
    descripcion: Optional[str]
    tipo: Optional[str]
    costo: Optional[int] = 0
    duracion_horas: Optional[float]
    incluye_guia: Optional[bool] = False
    activo: Optional[bool] = True
    class Config:
        from_attributes = True

class TemporadaSchema(BaseModel):
    id_destino: int
    mes: int
    clima: Optional[str]
    nivel_turistas: Optional[str]
    precio_nivel: Optional[str]
    recomendado: Optional[bool] = True
    nota: Optional[str]
    class Config:
        from_attributes = True

class TipSchema(BaseModel):
    id_destino: int
    contenido: str
    categoria: Optional[str]
    class Config:
        from_attributes = True

class ItemSchema(BaseModel):
    tipo_destino: str
    item: str
    categoria: Optional[str]
    esencial: Optional[bool] = False
    class Config:
        from_attributes = True

class ViajeSchema(BaseModel):
    id_destino: int
    ciudad_origen: Optional[str]
    distancia: Optional[int] = 0
    fecha_inicio: Optional[date]
    fecha_fin: Optional[date]
    num_dias: int
    estilo_viaje: Optional[str]
    costo_transporte: Optional[int] = 0
    costo_hospedaje: Optional[int] = 0
    costo_comidas: Optional[int] = 0
    costo_actividades: Optional[int] = 0
    costo_total: Optional[int] = 0
    class Config:
        from_attributes = True

class ViajeroSchema(BaseModel):
    id_viaje: int
    nom_viajero: str
    gasto_pagado: Optional[int] = 0
    gasto_asignado: Optional[int] = 0
    saldo: Optional[int] = 0
    class Config:
        from_attributes = True
