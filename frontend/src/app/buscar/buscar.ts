import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-buscar',
  imports: [CommonModule, RouterLink],
  templateUrl: './buscar.html',
  styleUrl: './buscar.css'
})
export class BuscarComponent implements OnInit {

  hoteles: any[] = [];
  restaurantes: any[] = [];
  destinos: any[] = [];
  actividades: any[] = [];
  vista: string = 'hoteles';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarHoteles();
  }

  private async getGsap() {
    const { default: gsap } = await import('gsap');
    return gsap;
  }

  // ===============================
  // CARGAS
  // ===============================

  cargarHoteles() {
    this.vista = 'hoteles';
    this.api.getHoteles().subscribe({
      next: (data: any) => {
        this.hoteles = data;
        this.cdr.detectChanges();
        setTimeout(() => this.animarCards(), 50);
      },
      error: () => { this.cdr.detectChanges(); }
    });
  }

  cargarRestaurantes() {
    this.vista = 'restaurantes';
    this.api.getRestaurantes().subscribe({
      next: (data: any) => {
        this.restaurantes = data;
        this.cdr.detectChanges();
        setTimeout(() => this.animarCards(), 50);
      },
      error: () => { this.cdr.detectChanges(); }
    });
  }

  cargarDestinos() {
    this.vista = 'sitios';
    this.api.getDestinos().subscribe({
      next: (data: any) => {
        this.destinos = data;
        this.cdr.detectChanges();
        setTimeout(() => this.animarCards(), 50);
      },
      error: () => { this.cdr.detectChanges(); }
    });
  }

  cargarActividades() {
    this.vista = 'actividades';
    this.api.getActividades().subscribe({
      next: (data: any) => {
        this.actividades = data;
        this.cdr.detectChanges();
        setTimeout(() => this.animarCards(), 50);
      },
      error: () => { this.cdr.detectChanges(); }
    });
  }

  // ===============================
  // ANIMACIONES
  // ===============================

  async animarCards() {
    const gsap = await this.getGsap();
    gsap.fromTo('.buscar-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
    );
  }

  async animarFiltros() {
    const gsap = await this.getGsap();
    gsap.fromTo('.filtro-tab',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)', stagger: 0.06 }
    );
  }

  // ===============================
  // IMÁGENES
  // ===============================

  getImagenHotel(hotel: any): string {
    const imagenes: any = {
      'Hotel Casa La Fe': 'https://www.kayak.com.pa/rimg/himg/4d/32/39/expedia_group-140393-241697018-550344.jpg?width=836&height=607&crop=true',
      'Hotel Dann Carlton Cali': 'https://image-tc.galaxy.tf/wijpeg-8vukdtn6dgt2i8s22npc4wz5z/negra-del-chontaduro-4.jpg?width=1920',
      'Hotel Dann Carlton Medellín': 'https://images.trvl-media.com/lodging/1000000/120000/112600/112569/cfd80cfb.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill',
      'Hotel Sochagota Paipa': 'https://hotelsochagota.com/wp-content/uploads/2017/11/11-1024x683.jpg',
      'Hotel Decameron San Andrés': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=900&h=-1&s=1'
    };
    return imagenes[hotel.nom_hotel] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
  }

  getImagenRestaurante(restaurante: any): string {
    const imagenes: any = {
      'La Cevichería': 'https://s3.amazonaws.com/takami.co/CACHE/images/brandcarouselimage/1e6e357ecefa4d0884d62478ec5396e9/ntwylar5lywkdjvtx5ffrb/30ad08a72aa6394488535f6e1351d4de.jpeg',
      'Ringlete Restaurante': 'https://www.cali.gov.co/info/caligovco_se/media/pubInt/thumbs/thMetapubInt_600X600_176092.jpg',
      'Criterion Restaurante': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/fe/eb/b5/criterion.jpg?w=900&h=500&s=1',
      'Restaurante El Pesebre Paipa': 'https://descubrepaipa.com/wp-content/uploads/2023/09/Blog-14-2-scaled.webp',
      'Miss Celia Restaurant': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/c5/94/5c/this-is-the-garden-which.jpg?w=900&h=500&s=1'
    };
    return imagenes[restaurante.nom_restaurante] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600';
  }

  getImagenDestino(destino: any): string {
    const imagenes: any = {
      1: 'https://mlqfmr3rpryd.i.optimole.com/cb:JBSP.a525/w:1024/h:814/q:100/ig:avif/https://cartagena-tours.co/wp-content/uploads/2023/12/49806996192_ec0e5e29b1_b.jpg',
      2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pdH6YZEBNdh5H_duICf9XhMj-ZYL_3yUHA&s',
      3: 'https://xixerone.com/wp-content/uploads/2019/03/Qu%C3%A9-hacer-en-El-Poblado-Medell%C3%ADn.jpg',
      4: 'https://cuponassets.cuponatic-latam.com/backendCo/uploads/imagenes_descuentos/200487/2d50792594dbd7b5f203cb0f5c57cd6f3a9648f8.XL2.jpg',
      5: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Panor%C3%A1mica_de_San_Andres.JPG'
    };
    return imagenes[destino.id_destino] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
  }

  // 🔥 ACTIVIDADES BIEN HECHO
  getImagenActividad(actividad: any): string {

    const nombre = actividad?.nom_actividad?.toLowerCase();

    const imagenes: any = {
      'tour en bicicleta': 'https://images.unsplash.com/photo-1508973378895-8d5d9c8d4d6c?w=600',
      'senderismo ecológico': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
      'tour gastronómico': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
      'parapente': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
      'buceo': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600',
      'city tour': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600'
    };

    return imagenes[nombre] || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600';
  }

}