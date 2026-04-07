import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'] || 'hoteles';

      if (tipo === 'hotel') this.cargarHoteles();
      else if (tipo === 'restaurante') this.cargarRestaurantes();
      else if (tipo === 'destino') this.cargarDestinos();
      else if (tipo === 'actividad') this.cargarActividades();
      else this.cargarDestinos();
    });
  }

  private async getGsap() {
    const { default: gsap } = await import('gsap');
    return gsap;
  }

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
      1: 'https://guiaviajarmelhor.com.br/wp-content/uploads/2022/06/cartagena-quando-ir.jpeg',
      2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pdH6YZEBNdh5H_duICf9XhMj-ZYL_3yUHA&s',
      3: 'https://xixerone.com/wp-content/uploads/2019/03/Qu%C3%A9-hacer-en-El-Poblado-Medell%C3%ADn.jpg',
      4: 'https://cuponassets.cuponatic-latam.com/backendCo/uploads/imagenes_descuentos/200487/2d50792594dbd7b5f203cb0f5c57cd6f3a9648f8.XL2.jpg',
      5: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Panor%C3%A1mica_de_San_Andres.JPG'
    };
    return imagenes[destino.id_destino] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
  }

  getImagenActividad(actividad: any): string {
    const imagenes: any = {
      'Tour en chiva por la ciudad amurallada': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d3/8b/2e/chiva-parrandera.jpg?w=900&h=500&s=1',
      'Clase de salsa en el centro de Cali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cali_salsa.jpg/1200px-Cali_salsa.jpg',
      'Tour en Metrocable línea L': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Medellin_Metrocable.jpg/1200px-Medellin_Metrocable.jpg',
      'Baños termales en Paipa': 'https://hotelsochagota.com/wp-content/uploads/2017/11/11-1024x683.jpg',
      'Buceo en el acuario de San Andrés': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=900&h=-1&s=1'
    };
    return imagenes[actividad.nom_actividad] || 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600';
  }

  getTipoColor(tipo: string): string {
    const colores: any = {
      'cultural': '#7c3aed',
      'aventura': '#dc2626',
      'relax': '#0891b2',
      'naturaleza': '#16a34a'
    };
    return colores[tipo] || '#1a1a1a';
  }
}