import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from '../services/api';
import { ClimaComponent } from '../clima/clima';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterLink, ClimaComponent],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class DetalleComponent implements OnInit, AfterViewInit, OnDestroy {

  tipo: string = '';
  id: number = 0;
  lugar: any = null;
  cargando: boolean = true;
  imagenActiva: number = 0;

  private autoplayInterval: any = null;

  private imagenesMap: { [key: string]: string[] } = {
    'Hotel Casa La Fe': [
      'https://media-cdn.tripadvisor.com/media/photo-s/1a/f1/9b/b1/hotel-casa-la-fe.jpg',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200'
    ],
    'Hotel Dann Carlton Cali': [
      'https://a.otcdn.com/imglib/hotelphotos/7/8/026/hotel-dann-carlton-cali-20240509175854888700.webp',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
      'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?w=1200',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'
    ],
    'Hotel Dann Carlton Medellín': [
      'https://hotelesdann.com/wp-content/uploads/2020/04/Carlton-Medellin.jpg',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=1200'
    ],
    'Hotel Sochagota Paipa': [
      'https://hotelsochagota.com/wp-content/uploads/2017/11/11-1024x683.jpg',
      'https://tse1.mm.bing.net/th/id/OIP.xWyGA4QfMVj1F6XvWHo2RgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200'
    ],
    'Hotel Decameron San Andrés': [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=900&h=-1&s=1',
      'https://tse2.mm.bing.net/th/id/OIP.W03fYOcNiY5pfT9JuEVmFAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200'
    ],
    'La Cevichería': [
      'https://s3.amazonaws.com/takami.co/CACHE/images/brandcarouselimage/1e6e357ecefa4d0884d62478ec5396e9/ntwylar5lywkdjvtx5ffrb/30ad08a72aa6394488535f6e1351d4de.jpeg',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://comococinarocomer.com/wp-content/uploads/como-funciona-una-cevicheria.jpg',
      'https://tse2.mm.bing.net/th/id/OIP.eca8SUdZjdSz7Yv4UNGEnAHaFl?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    'Ringlete Restaurante': [
      'https://www.cali.gov.co/info/caligovco_se/media/pubInt/thumbs/thMetapubInt_600X600_176092.jpg',
      'https://media.traveler.es/photos/6778ff3e0e766f7704e47825/16:9/w_2560%2Cc_limit/2BHRT6R%2520(1).jpg',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      'https://tse3.mm.bing.net/th/id/OIP.bOwuxDAQ59ELPqwRBmbDeQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3'
    ],
    'Criterion Restaurante': [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/fe/eb/b5/criterion.jpg?w=900&h=500&s=1',
      'https://i0.wp.com/media.scoutmagazine.ca/2009/08/west_int4.jpg?ssl=1',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://media-cdn.tripadvisor.com/media/photo-s/10/e5/63/5c/photo4jpg.jpg'
    ],
    'Restaurante El Pesebre Paipa': [
      'https://descubrepaipa.com/wp-content/uploads/2023/09/Blog-14-2-scaled.webp',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/c7/b0/7f/restaurante-con-vista.jpg?w=1200&h=-1&s=1',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/10/f5/34/sus-canapes-paipa-cheese.jpg?w=1200&h=800&s=1'
    ],
    'Miss Celia Restaurant': [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/c5/94/5c/this-is-the-garden-which.jpg?w=900&h=500&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f1/c0/3c/terraza-del-restaurante.jpg?w=1200&h=-1&s=1',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://i.pinimg.com/736x/fe/3b/b0/fe3bb07601f0e322879c526e9219791d.jpg'
    ]
  };

  readonly starsArray = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  private async getGsap() {
    const { default: gsap } = await import('gsap');
    return gsap;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.id = Number(params['id']);
      this.cargarDetalle();
    });
  }

  ngAfterViewInit() {
    this.animar();
  }

  cargarDetalle() {
    this.cargando = true;

    if (this.tipo === 'hotel') {
      this.api.getHotel(this.id).subscribe({
        next: (data: any) => {
          this.lugar = data;
          this.cargando = false;
          this.cdr.detectChanges();
          this.animar();
          this.iniciarAutoplay();
        },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    } else if (this.tipo === 'restaurante') {
      this.api.getRestaurante(this.id).subscribe({
        next: (data: any) => {
          this.lugar = data;
          this.cargando = false;
          this.cdr.detectChanges();
          this.animar();
          this.iniciarAutoplay();
        },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    } else if (this.tipo === 'destino') {
      this.api.getDestino(this.id).subscribe({
        next: (data: any) => {
          this.lugar = data;
          this.cargando = false;
          this.cdr.detectChanges();
          this.animar();
          this.iniciarAutoplay();
        },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    }
  }

  async animar() {
    setTimeout(async () => {
      const gsap = await this.getGsap();
      gsap.from('.corp-sidebar', { opacity: 0, x: -24, duration: 0.55, ease: 'power3.out' });
      gsap.from('.corp-main', { opacity: 0, y: 24, duration: 0.55, delay: 0.1, ease: 'power3.out' });
      gsap.from('.corp-section', { opacity: 0, y: 16, duration: 0.4, stagger: 0.08, delay: 0.25, ease: 'power2.out' });
    }, 50);
  }

  getImagePrincipal(): string {
    return this.getImagenes()[this.imagenActiva];
  }

  getImagenes(): string[] {
    const nombre = this.getNombre();
    return this.imagenesMap[nombre] ?? [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
    ];
  }

  cambiarImagen(index: number) {
    this.imagenActiva = index;
    this.iniciarAutoplay();
  }

  imagenAnterior() {
    const total = this.getImagenes().length;
    this.imagenActiva = (this.imagenActiva - 1 + total) % total;
    this.iniciarAutoplay();
  }

  imagenSiguiente() {
    const total = this.getImagenes().length;
    this.imagenActiva = (this.imagenActiva + 1) % total;
    this.iniciarAutoplay();
  }

  iniciarAutoplay() {
    this.detenerAutoplay();
    const total = this.getImagenes().length;
    if (total <= 1) return;
    this.autoplayInterval = setInterval(() => {
      this.imagenActiva = (this.imagenActiva + 1) % total;
      this.cdr.detectChanges();
    }, 4000);
  }

  detenerAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  ngOnDestroy() {
    this.detenerAutoplay();
  }

  getMapaUrl(): SafeResourceUrl {
    const lat = this.lugar?.latitud ?? 4.711;
    const lng = this.lugar?.longitud ?? -74.0721;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.007},${lng + 0.01},${lat + 0.007}&layer=mapnik&marker=${lat},${lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getGoogleMapsUrl(): string {
    const lat = this.lugar?.latitud;
    const lng = this.lugar?.longitud;
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  getNombre(): string {
    if (this.tipo === 'hotel') return this.lugar?.nom_hotel ?? '';
    if (this.tipo === 'restaurante') return this.lugar?.nom_restaurante ?? '';
    return this.lugar?.nom_destino ?? '';
  }

  getCategoria(): string {
    if (this.tipo === 'hotel') return this.lugar?.categoria ?? 'Hotel';
    if (this.tipo === 'restaurante') return this.lugar?.tipo_cocina ?? 'Restaurante';
    return this.lugar?.tipo_destino ?? 'Destino';
  }

  getUbicacion(): string {
    return this.lugar?.direccion ?? 'Ubicación no disponible';
  }

  getDescripcion(): string {
    return this.lugar?.descripcion ?? 'Sin descripción disponible';
  }

  getPrecio(): number {
    if (this.tipo === 'hotel') return this.lugar?.precio_noche ?? 0;
    if (this.tipo === 'restaurante') return this.lugar?.precio_promedio ?? 0;
    return 0;
  }

  getTipoUnidad(): string {
    if (this.tipo === 'hotel') return 'por noche';
    if (this.tipo === 'restaurante') return 'promedio';
    return '';
  }

  getRating(): number {
    if (this.tipo === 'hotel') return this.lugar?.estrellas ?? 0;
    return 5;
  }

  getDatosGenerales(): any[] {
    if (this.tipo === 'hotel') {
      return [
        { icon: '⭐', label: 'Calificación',  value: `${this.lugar?.estrellas ?? 0} / 5` },
        { icon: '🏷️', label: 'Categoría',     value: this.lugar?.categoria ?? 'N/A' },
        { icon: '📞', label: 'Teléfono',      value: this.lugar?.telefono ?? 'N/A' },
        { icon: '🌐', label: 'Web',           value: this.lugar?.sitio_web ?? 'N/A' }
      ];
    }
    if (this.tipo === 'restaurante') {
      return [
        { icon: '🍽️', label: 'Tipo de Cocina', value: this.lugar?.tipo_cocina ?? 'N/A' },
        { icon: '🏷️', label: 'Categoría',      value: this.lugar?.categoria ?? 'N/A' },
        { icon: '🕐', label: 'Horario',        value: this.lugar?.horario ?? 'N/A' },
        { icon: '📞', label: 'Teléfono',       value: this.lugar?.telefono ?? 'N/A' }
      ];
    }
    return [
      { icon: '📍', label: 'Tipo',   value: this.lugar?.tipo_destino ?? 'N/A' },
      { icon: '✅', label: 'Estado', value: this.lugar?.activo ? 'Activo' : 'Inactivo' }
    ];
  }

  getDetallesExtra(): any[] {
    if (this.tipo === 'hotel') {
      return [
        { label: 'Precio por Noche', value: `$${this.lugar?.precio_noche ?? 0}` },
        { label: 'Sitio Web',        value: `<a href="https://${this.lugar?.sitio_web}" target="_blank">${this.lugar?.sitio_web}</a>` }
      ];
    }
    if (this.tipo === 'restaurante') {
      return [
        { label: 'Precio Promedio',     value: `$${this.lugar?.precio_promedio ?? 0}` },
        { label: 'Horario de Atención', value: this.lugar?.horario ?? 'N/A' }
      ];
    }
    return [];
  }
}