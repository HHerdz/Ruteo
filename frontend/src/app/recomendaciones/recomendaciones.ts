import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import gsap from 'gsap';

@Component({
  selector: 'app-recomendaciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css'
})
export class RecomendacionesComponent implements OnInit, AfterViewInit {

  destinos: any[] = [];
  destinoSeleccionado: number = -1;
  cargando: boolean = false;
  mostrarConsejos: boolean = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.api.getDestinos().subscribe({
      next: (data: any) => {
        this.destinos = data;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  ngAfterViewInit() {
    gsap.from('.rec-header', { opacity: 0, y: 60, duration: 0.8, ease: 'power3.out' });
    gsap.from('.rec-selector', { opacity: 0, y: 60, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  }

  buscarRecomendaciones() {
    if (this.destinoSeleccionado === -1) return;
    this.cargando = true;
    this.mostrarConsejos = false;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.cargando = false;
      this.mostrarConsejos = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        gsap.from('.consejo-card', {
          opacity: 0, y: 50, duration: 0.5, stagger: 0.1, ease: 'power2.out'
        });
      }, 50);
    }, 600);
  }
}