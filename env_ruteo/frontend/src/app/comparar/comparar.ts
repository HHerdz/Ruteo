import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-comparar',
  imports: [CommonModule, FormsModule],
  templateUrl: './comparar.html',
  styleUrl: './comparar.css'
})
export class CompararComponent implements OnInit, AfterViewInit {

  tipo: string = 'hotel';
  hoteles: any[] = [];
  restaurantes: any[] = [];
  seleccionados: any[] = [];
  cargando: boolean = true;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private el: ElementRef) {}

  private async getGsap() {
    const { default: gsap } = await import('gsap');
    return gsap;
  }

  ngOnInit() {
    this.cargarHoteles();
  }

  async ngAfterViewInit() {
    const gsap = await this.getGsap();
    gsap.from('.comparar-titulo', { opacity: 0, y: -30, duration: 0.6, ease: 'power2.out' });
    gsap.from('.comparar-tabs', { opacity: 0, y: 20, duration: 0.5, delay: 0.2, ease: 'power2.out' });
  }

  cargarHoteles() {
    this.tipo = 'hotel';
    this.seleccionados = [];
    this.cargando = true;
    this.api.getHoteles().subscribe({
      next: (data: any) => {
        this.hoteles = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.animarLista();
      },
      error: () => { this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  cargarRestaurantes() {
    this.tipo = 'restaurante';
    this.seleccionados = [];
    this.cargando = true;
    this.api.getRestaurantes().subscribe({
      next: (data: any) => {
        this.restaurantes = data;
        this.cargando = false;
        this.cdr.detectChanges();
        this.animarLista();
      },
      error: () => { this.cargando = false; this.cdr.detectChanges(); }
    });
  }

  animarLista() {
    setTimeout(async () => {
      const gsap = await this.getGsap();
      gsap.from('.item-card', {
        opacity: 0,
        y: 20,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, 50);
  }

  toggleSeleccion(item: any) {
    const index = this.seleccionados.findIndex(s => s === item);
    if (index >= 0) {
      this.seleccionados.splice(index, 1);
    } else if (this.seleccionados.length < 3) {
      this.seleccionados.push(item);
      setTimeout(async () => {
        const gsap = await this.getGsap();
        gsap.from('.tabla-comparar', { opacity: 0, y: 30, duration: 0.5, ease: 'power2.out' });
      }, 50);
    }
    this.cdr.detectChanges();
  }

  estaSeleccionado(item: any) {
    return this.seleccionados.includes(item);
  }

  getMenorPrecio() {
    if (this.seleccionados.length === 0) return null;
    if (this.tipo === 'hotel') {
      return Math.min(...this.seleccionados.map(s => s.precio_noche));
    }
    return Math.min(...this.seleccionados.map(s => s.precio_promedio));
  }
}