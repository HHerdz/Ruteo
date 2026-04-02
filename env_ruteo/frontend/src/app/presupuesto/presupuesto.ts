import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-presupuesto',
  imports: [CommonModule, FormsModule],
  templateUrl: './presupuesto.html',
  styleUrl: './presupuesto.css'
})
export class PresupuestoComponent implements AfterViewInit {

  numDias: number = 1;
  numPersonas: number = 1;
  estiloViaje: string = 'economico';

  costoTransporte: number = 0;
  costoHospedaje: number = 0;
  costoComidas: number = 0;
  costoActividades: number = 0;
  costoExtras: number = 0;

  ngAfterViewInit() {
    gsap.from('.presupuesto-titulo', { opacity: 0, y: -30, duration: 0.6, ease: 'power2.out' });
    gsap.from('.presupuesto-form', { opacity: 0, x: -40, duration: 0.6, delay: 0.2, ease: 'power2.out' });
    gsap.from('.presupuesto-resumen', { opacity: 0, x: 40, duration: 0.6, delay: 0.3, ease: 'power2.out' });
  }

  get costoTotal() {
    return this.costoTransporte + this.costoHospedaje + this.costoComidas + this.costoActividades + this.costoExtras;
  }

  get costoPorPersona() {
    return this.numPersonas > 0 ? Math.round(this.costoTotal / this.numPersonas) : 0;
  }

  get porcentajeTransporte() {
    return this.costoTotal > 0 ? Math.round((this.costoTransporte / this.costoTotal) * 100) : 0;
  }

  get porcentajeHospedaje() {
    return this.costoTotal > 0 ? Math.round((this.costoHospedaje / this.costoTotal) * 100) : 0;
  }

  get porcentajeComidas() {
    return this.costoTotal > 0 ? Math.round((this.costoComidas / this.costoTotal) * 100) : 0;
  }

  get porcentajeActividades() {
    return this.costoTotal > 0 ? Math.round((this.costoActividades / this.costoTotal) * 100) : 0;
  }

  get porcentajeExtras() {
    return this.costoTotal > 0 ? Math.round((this.costoExtras / this.costoTotal) * 100) : 0;
  }

  aplicarEstilo() {
    if (this.estiloViaje === 'economico') {
      this.costoHospedaje = 60000 * this.numDias;
      this.costoComidas = 30000 * this.numDias * this.numPersonas;
      this.costoActividades = 20000 * this.numDias;
    } else if (this.estiloViaje === 'estandar') {
      this.costoHospedaje = 150000 * this.numDias;
      this.costoComidas = 60000 * this.numDias * this.numPersonas;
      this.costoActividades = 50000 * this.numDias;
    } else if (this.estiloViaje === 'premium') {
      this.costoHospedaje = 400000 * this.numDias;
      this.costoComidas = 120000 * this.numDias * this.numPersonas;
      this.costoActividades = 150000 * this.numDias;
    }
  }

  limpiar() {
    this.costoTransporte = 0;
    this.costoHospedaje = 0;
    this.costoComidas = 0;
    this.costoActividades = 0;
    this.costoExtras = 0;
    this.numDias = 1;
    this.numPersonas = 1;
  }
}