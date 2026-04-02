import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'http://localhost:8000/ruteo';

  constructor(private http: HttpClient) {}

  // CIUDADES
  getCiudades() {
    return this.http.get(`${this.url}/ciudades/all`);
  }
  getCiudad(id: number) {
    return this.http.get(`${this.url}/ciudades/${id}`);
  }
  crearCiudad(data: any) {
    return this.http.post(`${this.url}/ciudades/add`, data);
  }
  actualizarCiudad(id: number, data: any) {
    return this.http.put(`${this.url}/ciudades/update/${id}`, data);
  }
  borrarCiudad(id: number) {
    return this.http.delete(`${this.url}/ciudades/borrar/${id}`);
  }

  // DESTINOS
  getDestinos() {
    return this.http.get(`${this.url}/destinos/all`);
  }
  getDestino(id: number) {
    return this.http.get(`${this.url}/destinos/${id}`);
  }
  crearDestino(data: any) {
    return this.http.post(`${this.url}/destinos/add`, data);
  }
  actualizarDestino(id: number, data: any) {
    return this.http.put(`${this.url}/destinos/update/${id}`, data);
  }
  borrarDestino(id: number) {
    return this.http.delete(`${this.url}/destinos/borrar/${id}`);
  }

  // HOTELES
  getHoteles() {
    return this.http.get(`${this.url}/hoteles/all`);
  }
  getHotel(id: number) {
    console.log('llamando hotel:', id);
    return this.http.get(`${this.url}/hoteles/${id}`);
  }
  crearHotel(data: any) {
    return this.http.post(`${this.url}/hoteles/add`, data);
  }
  actualizarHotel(id: number, data: any) {
    return this.http.put(`${this.url}/hoteles/update/${id}`, data);
  }
  borrarHotel(id: number) {
    return this.http.delete(`${this.url}/hoteles/borrar/${id}`);
  }

  // RESTAURANTES
  getRestaurantes() {
    return this.http.get(`${this.url}/restaurantes/all`);
  }
  getRestaurante(id: number) {
    return this.http.get(`${this.url}/restaurantes/${id}`);
  }
  crearRestaurante(data: any) {
    return this.http.post(`${this.url}/restaurantes/add`, data);
  }
  actualizarRestaurante(id: number, data: any) {
    return this.http.put(`${this.url}/restaurantes/update/${id}`, data);
  }
  borrarRestaurante(id: number) {
    return this.http.delete(`${this.url}/restaurantes/borrar/${id}`);
  }

  // ACTIVIDADES
  getActividades() {
    return this.http.get(`${this.url}/actividades/all`);
  }
  getActividad(id: number) {
    return this.http.get(`${this.url}/actividades/${id}`);
  }
  crearActividad(data: any) {
    return this.http.post(`${this.url}/actividades/add`, data);
  }
  actualizarActividad(id: number, data: any) {
    return this.http.put(`${this.url}/actividades/update/${id}`, data);
  }
  borrarActividad(id: number) {
    return this.http.delete(`${this.url}/actividades/borrar/${id}`);
  }

  // VIAJES
  getViajes() {
    return this.http.get(`${this.url}/viajes/all`);
  }
  getViaje(id: number) {
    return this.http.get(`${this.url}/viajes/${id}`);
  }
  crearViaje(data: any) {
    return this.http.post(`${this.url}/viajes/add`, data);
  }
  actualizarViaje(id: number, data: any) {
    return this.http.put(`${this.url}/viajes/update/${id}`, data);
  }
  borrarViaje(id: number) {
    return this.http.delete(`${this.url}/viajes/borrar/${id}`);
  }

  // VIAJEROS
  getViajeros() {
    return this.http.get(`${this.url}/viajeros/all`);
  }
  getViajero(id: number) {
    return this.http.get(`${this.url}/viajeros/${id}`);
  }
  crearViajero(data: any) {
    return this.http.post(`${this.url}/viajeros/add`, data);
  }
  actualizarViajero(id: number, data: any) {
    return this.http.put(`${this.url}/viajeros/update/${id}`, data);
  }
  borrarViajero(id: number) {
    return this.http.delete(`${this.url}/viajeros/borrar/${id}`);
  }
}