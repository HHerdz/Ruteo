import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-gastos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gastos.html',
  styleUrl: './gastos.css'
})
export class GastosComponent implements AfterViewInit {

  nombreViajero: string = '';
  viajeros: string[] = [];
  montoTotal: number = 0;

  ngAfterViewInit() {
    gsap.from('.gastos-header', {
      opacity: 0, y: 60, duration: 0.8, ease: 'power3.out'
    });
    gsap.from('.gastos-left', {
      opacity: 0, y: 80, duration: 0.8, delay: 0.15, ease: 'power3.out'
    });
    gsap.from('.gastos-right', {
      opacity: 0, y: 80, duration: 0.8, delay: 0.3, ease: 'power3.out'
    });
  }

  get costoPorPersona() {
    if (this.viajeros.length === 0) return 0;
    return Math.round(this.montoTotal / this.viajeros.length);
  }

  agregarViajero() {
    if (this.nombreViajero.trim() === '') return;
    this.viajeros.push(this.nombreViajero.trim());
    this.nombreViajero = '';
    setTimeout(() => {
      const items = document.querySelectorAll('.viajero-item');
      const ultimo = items[items.length - 1];
      if (ultimo) {
        gsap.from(ultimo, { opacity: 0, y: 30, duration: 0.4, ease: 'power2.out' });
      }
    }, 50);
  }

  eliminarViajero(index: number) {
    const items = document.querySelectorAll('.viajero-item');
    const item = items[index];
    if (item) {
      gsap.to(item, {
        opacity: 0, x: -30, duration: 0.3, ease: 'power2.in',
        onComplete: () => { this.viajeros.splice(index, 1); }
      });
    } else {
      this.viajeros.splice(index, 1);
    }
  }

  limpiar() {
    gsap.to('.viajero-item', {
      opacity: 0, y: -20, duration: 0.3, stagger: 0.05, ease: 'power2.in',
      onComplete: () => {
        this.viajeros = [];
        this.montoTotal = 0;
        this.nombreViajero = '';
      }
    });
  }
}