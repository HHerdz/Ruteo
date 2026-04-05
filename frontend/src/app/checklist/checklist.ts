import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checklist',
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist.html',
  styleUrl: './checklist.css'
})
export class ChecklistComponent implements AfterViewInit {

  nuevoItem: string = '';

  items: any[] = [
    { nombre: 'Documentos de identidad', completado: false },
    { nombre: 'Dinero en efectivo', completado: false },
    { nombre: 'Ropa para el clima', completado: false },
    { nombre: 'Medicamentos', completado: false },
    { nombre: 'Cargador del celular', completado: false },
    { nombre: 'Mapa o GPS', completado: false }
  ];

  private async getGsap() {
    const { default: gsap } = await import('gsap');
    return gsap;
  }

  async ngAfterViewInit() {
    const gsap = await this.getGsap();
    gsap.from('.checklist-header', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' });
    gsap.from('.checklist-card', { opacity: 0, y: 80, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    setTimeout(() => {
      gsap.from('.checklist-item', {
        opacity: 0, y: 20, duration: 0.4, stagger: 0.07, ease: 'power2.out'
      });
    }, 300);
  }

  get completados() {
    return this.items.filter(i => i.completado).length;
  }

  get porcentaje() {
    return this.items.length > 0 ? Math.round((this.completados / this.items.length) * 100) : 0;
  }

  async agregarItem() {
    if (this.nuevoItem.trim() === '') return;
    this.items.push({ nombre: this.nuevoItem.trim(), completado: false });
    this.nuevoItem = '';
    setTimeout(async () => {
      const gsap = await this.getGsap();
      const items = document.querySelectorAll('.checklist-item');
      const ultimo = items[items.length - 1];
      if (ultimo) {
        gsap.from(ultimo, { opacity: 0, y: 30, duration: 0.4, ease: 'power2.out' });
      }
    }, 50);
  }

  eliminarItem(index: number) {
    const items = document.querySelectorAll('.checklist-item');
    const item = items[index];
    if (item) {
      this.getGsap().then(gsap => {
        gsap.to(item, {
          opacity: 0, x: 30, duration: 0.3, ease: 'power2.in',
          onComplete: () => { this.items.splice(index, 1); }
        });
      });
    } else {
      this.items.splice(index, 1);
    }
  }

  limpiar() {
    this.items = this.items.map(i => ({ ...i, completado: false }));
  }
}