from database import Base
from sqlalchemy import Column, Integer, String, Text, Boolean, Numeric, Date, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship


# ============================================
# TABLA: ciudades
# ============================================
class Ciudad(Base):
    __tablename__ = "ciudades"

    id_ciudad = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nom_ciudad = Column(String(100), nullable=False)
    departamento = Column(String(50), nullable=False)

    destinos = relationship("Destino", back_populates="ciudad")


# ============================================
# TABLA: destinos
# ============================================
class Destino(Base):
    __tablename__ = "destinos"

    id_destino = Column(Integer, primary_key=True, autoincrement=True, index=True)
    nom_destino = Column(String(150), nullable=False)
    descripcion = Column(Text)
    id_ciudad = Column(Integer, ForeignKey("ciudades.id_ciudad"), nullable=False)
    tipo_destino = Column(String(50), nullable=False)
    imagen_url = Column(String(255))
    latitud = Column(Numeric(10, 7))
    longitud = Column(Numeric(10, 7))
    activo = Column(Boolean, default=True)

    ciudad = relationship("Ciudad", back_populates="destinos")
    hoteles = relationship("Hotel", back_populates="destino")
    restaurantes = relationship("Restaurante", back_populates="destino")
    actividades = relationship("Actividad", back_populates="destino")
    temporadas = relationship("Temporada", back_populates="destino")
    tips = relationship("Tip", back_populates="destino")
    viajes = relationship("Viaje", back_populates="destino")


# ============================================
# TABLA: hoteles
# ============================================
class Hotel(Base):
    __tablename__ = "hoteles"

    id_hotel = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    nom_hotel = Column(String(150), nullable=False)
    descripcion = Column(Text)
    categoria = Column(String(20), nullable=False)
    estrellas = Column(Integer, CheckConstraint("estrellas BETWEEN 1 AND 5"))
    precio_noche = Column(Integer, nullable=False)
    direccion = Column(String(255))
    telefono = Column(String(20))
    sitio_web = Column(String(255))
    latitud = Column(Numeric(10, 7))
    longitud = Column(Numeric(10, 7))
    activo = Column(Boolean, default=True)

    destino = relationship("Destino", back_populates="hoteles")


# ============================================
# TABLA: restaurantes
# ============================================
class Restaurante(Base):
    __tablename__ = "restaurantes"

    id_restaurante = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    nom_restaurante = Column(String(150), nullable=False)
    descripcion = Column(Text)
    tipo_cocina = Column(String(100))
    categoria = Column(String(20), nullable=False)
    precio_promedio = Column(Integer, nullable=False)
    direccion = Column(String(255))
    telefono = Column(String(20))
    horario = Column(String(100))
    latitud = Column(Numeric(10, 7))
    longitud = Column(Numeric(10, 7))
    activo = Column(Boolean, default=True)

    destino = relationship("Destino", back_populates="restaurantes")


# ============================================
# TABLA: actividades
# ============================================
class Actividad(Base):
    __tablename__ = "actividades"

    id_actividad = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    nom_actividad = Column(String(150), nullable=False)
    descripcion = Column(Text)
    tipo = Column(String(50))
    costo = Column(Integer, default=0)
    duracion_horas = Column(Numeric(4, 1))
    incluye_guia = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)

    destino = relationship("Destino", back_populates="actividades")


# ============================================
# TABLA: temporadas
# ============================================
class Temporada(Base):
    __tablename__ = "temporadas"

    id_temporada = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    mes = Column(Integer, CheckConstraint("mes BETWEEN 1 AND 12"), nullable=False)
    clima = Column(String(50))
    nivel_turistas = Column(String(20))
    precio_nivel = Column(String(20))
    recomendado = Column(Boolean, default=True)
    nota = Column(String(255))

    destino = relationship("Destino", back_populates="temporadas")


# ============================================
# TABLA: tips
# ============================================
class Tip(Base):
    __tablename__ = "tips"

    id_tip = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    contenido = Column(Text, nullable=False)
    categoria = Column(String(50))

    destino = relationship("Destino", back_populates="tips")


# ============================================
# TABLA: items
# ============================================
class Item(Base):
    __tablename__ = "items"

    id_item = Column(Integer, primary_key=True, autoincrement=True, index=True)
    tipo_destino = Column(String(50), nullable=False)
    item = Column(String(150), nullable=False)
    categoria = Column(String(50))
    esencial = Column(Boolean, default=False)


# ============================================
# TABLA: viajes
# ============================================
class Viaje(Base):
    __tablename__ = "viajes"

    id_viaje = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_destino = Column(Integer, ForeignKey("destinos.id_destino"), nullable=False)
    ciudad_origen = Column(String(100))
    distancia = Column(Integer, default=0)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    num_dias = Column(Integer, nullable=False)
    estilo_viaje = Column(String(20))
    costo_transporte = Column(Integer, default=0)
    costo_hospedaje = Column(Integer, default=0)
    costo_comidas = Column(Integer, default=0)
    costo_actividades = Column(Integer, default=0)
    costo_total = Column(Integer, default=0)

    destino = relationship("Destino", back_populates="viajes")
    viajeros = relationship("Viajero", back_populates="viaje")


# ============================================
# TABLA: viajeros
# ============================================
class Viajero(Base):
    __tablename__ = "viajeros"

    id_viajero = Column(Integer, primary_key=True, autoincrement=True, index=True)
    id_viaje = Column(Integer, ForeignKey("viajes.id_viaje"), nullable=False)
    nom_viajero = Column(String(100), nullable=False)
    gasto_pagado = Column(Integer, default=0)
    gasto_asignado = Column(Integer, default=0)
    saldo = Column(Integer, default=0)

    viaje = relationship("Viaje", back_populates="viajeros")