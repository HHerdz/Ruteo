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
  temporadas: any[] = [];

  private autoplayInterval: any = null;
  private routeSub: any; // ✅ para desuscribirse en ngOnDestroy

  private imagenesMap: { [key: string]: string[] } = {

    // ── DESTINOS ──────────────────────────────────────────────────
    'Ciudad Amurallada': [
      'https://guiaviajarmelhor.com.br/wp-content/uploads/2022/06/cartagena-quando-ir.jpeg',
      'https://img.freepik.com/fotos-premium/colombia-cartagena-ciudad-amurallada-cuidad-amurrallada-coloridos-edificios-centro-historico-ciudad_451699-598.jpg?w=2000',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200',
      'https://img.freepik.com/fotos-premium/colombia-cartagena-ciudad-amurallada-cuidad-amurrallada-coloridos-edificios-centro-historico-ciudad_451699-547.jpg?w=2000'
    ],
    'Cali Centro Histórico': [
      'https://www.spiwak.com/uploads/cms/TEATRO-MUNICIPAL-ENRIQUE-BUENAVENTURA-CALI-BLOG-SPIWAK.webp',
      'https://viajarverde.com.br/wp-content/uploads/2021/12/Viajar-conheca-os-principais-pontos-turisticos-na-Colombia-centro-historico-em-Cali-1024x768.jpeg',
      'https://padondenosvamos.com/wp-content/uploads/2020/10/centro-historico-cali-700x420.jpg',
      'https://www.semana.com/resizer/v2/5UJXQVGUBBFTFH5KYXNG2SJTQM.jpg?auth=21afc501addfac71a79773aef1cc3569726eb938aa23bceccaafe53944707b11&smart=true&quality=75&width=1280&height=720'
    ],
    'El Poblado': [
      'https://xixerone.com/wp-content/uploads/2019/03/Qu%C3%A9-hacer-en-El-Poblado-Medell%C3%ADn.jpg',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
      'https://gobackpacking.com/wp-content/uploads/2021/09/El-Poblado-Medellin.jpg',
      'https://global.unitednations.entermediadb.net/assets/mediadb/services/module/asset/downloads/preset/Libraries/Production+Library/29-03-2021_Unsplash_Colombia.jpg/image1170x530cropped.jpg'
    ],
    'Pozo Azul de Paipa': [
      'https://i.pinimg.com/736x/95/f0/1d/95f01d202ca5891853c4b1bb97402e75.jpg',
      'https://www.hotelsanmarcospaipa.com/wp-content/uploads/2024/01/termales-de-paipa-1141980-1024x555.jpg',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://viajescolombiaviva.com/wp-content/uploads/elementor/thumbs/termales00-po20l8ca88qkezs7wmg1ljqovi3f3vvrn6tyvm2ums.jpg'
    ],
    'Isla de San Andrés': [
      'https://upload.wikimedia.org/wikipedia/commons/4/43/Panor%C3%A1mica_de_San_Andres.JPG',
      'https://conocedores.com/wp-content/uploads/2020/11/isla-san-andres-05112020.jpg',
      'https://guiaviajarmelhor.com.br/wp-content/uploads/2023/06/fotos-de-san-andres-scaled.jpg',
      'https://upgradedpoints.com/wp-content/uploads/2020/06/Punta-Cana-1536x1024.jpg'
    ],

    // ── HOTELES ───────────────────────────────────────────────────
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

    // ── RESTAURANTES ──────────────────────────────────────────────
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
    ],

    // ── ACTIVIDADES ───────────────────────────────────────────────
    'Tour en chiva por la ciudad amurallada': [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/d3/8b/2e/chiva-parrandera.jpg?w=900&h=500&s=1',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200'
    ],
    'Clase de salsa en el centro de Cali': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Cali_salsa.jpg/1200px-Cali_salsa.jpg',
      'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=1200',
      'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=1200',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200'
    ],
    'Tour en Metrocable línea L': [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Medellin_Metrocable.jpg/1200px-Medellin_Metrocable.jpg',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200'
    ],
    'Baños termales en Paipa': [
      'https://hotelsochagota.com/wp-content/uploads/2017/11/11-1024x683.jpg',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200'
    ],
    'Buceo en el acuario de San Andrés': [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/24/88/76/decameron-aquarium.jpg?w=900&h=-1&s=1',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200',
      'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=1200'
    ]
  };

  readonly starsArray = [1, 2, 3, 4, 5];

  readonly mesesNombres: { [key: number]: string } = {
    1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
    5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
    9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => { // ✅ guardamos suscripción
      this.tipo = params['tipo'];
      this.id = Number(params['id']);
      this.cargarDetalle();
    });
  }

  ngAfterViewInit() {
    // ✅ eliminado this.animar() de aquí para evitar doble animación
  }

  cargarDetalle() {
    this.cargando = true;
    this.temporadas = [];

    if (this.tipo === 'hotel') {
      this.api.getHotel(this.id).subscribe({
        next: (data: any) => { this.lugar = data; this.finalizarCarga(); },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    } else if (this.tipo === 'restaurante') {
      this.api.getRestaurante(this.id).subscribe({
        next: (data: any) => { this.lugar = data; this.finalizarCarga(); },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    } else if (this.tipo === 'destino') {
      this.api.getDestino(this.id).subscribe({
        next: (data: any) => {
          this.lugar = data;
          this.finalizarCarga();
          this.cargarTemporadas();
        },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    } else if (this.tipo === 'actividad') {
      this.api.getActividad(this.id).subscribe({
        next: (data: any) => { this.lugar = data; this.finalizarCarga(); },
        error: () => { this.cargando = false; this.cdr.detectChanges(); }
      });
    }
  }

  finalizarCarga() {
    this.cargando = false;
    this.cdr.detectChanges();
    this.animar();
    this.iniciarAutoplay();
  }

  cargarTemporadas() {
    this.api.getTemporadasPorDestino(this.id).subscribe({
      next: (data: any) => {
        this.temporadas = data;
        this.cdr.detectChanges();
        this.animarTemporadas();
      },
      error: () => {}
    });
  }

  async animar() {
    const gsap = await import('gsap').then(m => m.default); // ✅ import directo
    setTimeout(() => {
      gsap.from('.corp-sidebar', { opacity: 0, x: -24, duration: 0.55, ease: 'power3.out' });
      gsap.from('.corp-main',    { opacity: 0, y: 24,  duration: 0.55, delay: 0.1,  ease: 'power3.out' });
      gsap.from('.corp-section', { opacity: 0, y: 16,  duration: 0.4,  stagger: 0.08, delay: 0.25, ease: 'power2.out' });
    }, 50);
  }

  async animarTemporadas() {
    const gsap = await import('gsap').then(m => m.default);
    setTimeout(() => {
      gsap.fromTo('.temporada-card',
        { opacity: 0, y: 22, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', stagger: 0.08 }
      );
      gsap.fromTo('.temporada-barra-fill',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power2.out', stagger: 0.08, delay: 0.25, transformOrigin: 'left center' }
      );
    }, 80);
  }

  getImagenes(): string[] {
    const nombre = this.getNombre();
    return this.imagenesMap[nombre] ?? ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200'];
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
    const imagenes = this.getImagenes();
    if (imagenes.length <= 1) return;
    this.autoplayInterval = setInterval(() => {
      this.imagenActiva = (this.imagenActiva + 1) % imagenes.length;
      this.cdr.detectChanges();
    }, 4000);
  }

  detenerAutoplay() {
    if (this.autoplayInterval) { clearInterval(this.autoplayInterval); this.autoplayInterval = null; }
  }

  ngOnDestroy() {
    this.detenerAutoplay();
    this.routeSub?.unsubscribe(); // ✅ evita memory leak
  }

  getMapaUrl(): SafeResourceUrl {
    const lat = this.lugar?.latitud ?? 4.711;
    const lng = this.lugar?.longitud ?? -74.0721;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.007},${lng + 0.01},${lat + 0.007}&layer=mapnik&marker=${lat},${lng}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getNombre(): string {
    if (this.tipo === 'hotel')       return this.lugar?.nom_hotel ?? '';
    if (this.tipo === 'restaurante') return this.lugar?.nom_restaurante ?? '';
    if (this.tipo === 'actividad')   return this.lugar?.nom_actividad ?? '';
    return this.lugar?.nom_destino ?? '';
  }

  getCategoria(): string {
    if (this.tipo === 'hotel')       return this.lugar?.categoria ?? 'Hotel';
    if (this.tipo === 'restaurante') return this.lugar?.tipo_cocina ?? 'Restaurante';
    if (this.tipo === 'actividad')   return this.lugar?.tipo ?? 'Actividad';
    return this.lugar?.tipo_destino ?? 'Destino';
  }

  getDescripcion(): string { return this.lugar?.descripcion ?? 'Sin descripción disponible'; }

  getPrecio(): number {
    if (this.tipo === 'hotel')       return this.lugar?.precio_noche ?? 0;
    if (this.tipo === 'restaurante') return this.lugar?.precio_promedio ?? 0;
    if (this.tipo === 'actividad')   return this.lugar?.costo ?? 0;
    return 0;
  }

  getTipoUnidad(): string {
    if (this.tipo === 'hotel')       return 'por noche';
    if (this.tipo === 'restaurante') return 'promedio';
    if (this.tipo === 'actividad')   return 'por persona';
    return '';
  }

  getRating(): number {
    if (this.tipo === 'hotel') return this.lugar?.estrellas ?? 0;
    return 5;
  }

  getDatosGenerales(): any[] {
    if (this.tipo === 'hotel') return [
      { icon: '⭐', label: 'Calificación', value: `${this.lugar?.estrellas ?? 0} / 5` },
      { icon: '🏷️', label: 'Categoría',    value: this.lugar?.categoria ?? 'N/A' },
      { icon: '📞', label: 'Teléfono',     value: this.lugar?.telefono ?? 'N/A' },
      { icon: '🌐', label: 'Web',          value: this.lugar?.sitio_web ?? 'N/A' }
    ];
    if (this.tipo === 'restaurante') return [
      { icon: '🍽️', label: 'Tipo de Cocina', value: this.lugar?.tipo_cocina ?? 'N/A' },
      { icon: '🏷️', label: 'Categoría',      value: this.lugar?.categoria ?? 'N/A' },
      { icon: '🕐', label: 'Horario',        value: this.lugar?.horario ?? 'N/A' },
      { icon: '📞', label: 'Teléfono',       value: this.lugar?.telefono ?? 'N/A' }
    ];
    if (this.tipo === 'actividad') return [
      { icon: '🏷️', label: 'Tipo',        value: this.lugar?.tipo ?? 'N/A' },
      { icon: '⏱️', label: 'Duración',     value: `${this.lugar?.duracion_horas ?? 0} horas` },
      { icon: '🧭', label: 'Incluye guía', value: this.lugar?.incluye_guia ? 'Sí' : 'No' },
      { icon: '✅', label: 'Disponible',   value: this.lugar?.activo ? 'Sí' : 'No' }
    ];
    return [
      { icon: '📍', label: 'Tipo',   value: this.lugar?.tipo_destino ?? 'N/A' },
      { icon: '✅', label: 'Estado', value: this.lugar?.activo ? 'Activo' : 'Inactivo' }
    ];
  }

  getDetallesExtra(): any[] {
    if (this.tipo === 'hotel') return [
      { label: 'Precio por Noche', value: `$${this.lugar?.precio_noche ?? 0}` },
      { label: 'Sitio Web', value: `<a href="https://${this.lugar?.sitio_web}" target="_blank">${this.lugar?.sitio_web}</a>` }
    ];
    if (this.tipo === 'restaurante') return [
      { label: 'Precio Promedio',     value: `$${this.lugar?.precio_promedio ?? 0}` },
      { label: 'Horario de Atención', value: this.lugar?.horario ?? 'N/A' }
    ];
    if (this.tipo === 'actividad') return [
      { label: 'Costo',        value: this.lugar?.costo > 0 ? `$${this.lugar?.costo}` : 'Gratis' },
      { label: 'Duración',     value: `${this.lugar?.duracion_horas ?? 0} horas` },
      { label: 'Incluye Guía', value: this.lugar?.incluye_guia ? 'Sí' : 'No' }
    ];
    return [];
  }

  // ── Temporadas ──────────────────────────────────────────────────
  getNombreMes(mes: number): string {
    return this.mesesNombres[mes] ?? `Mes ${mes}`;
  }

  getClimaIcon(clima: string): string {
    const map: { [k: string]: string } = {
      'seco': '☀️', 'lluvioso': '🌧️', 'frio': '❄️',
      'templado': '🌤️', 'calido': '🌡️', 'humedo': '💧'
    };
    return map[clima?.toLowerCase()] ?? '🌤️';
  }

  getNivelClase(nivel: string): string {
    const map: { [k: string]: string } = {
      'alto': 'badge--rojo', 'medio': 'badge--naranja', 'bajo': 'badge--verde'
    };
    return map[nivel?.toLowerCase()] ?? 'badge--gris';
  }

  getPrecioClase(precio: string): string {
    const map: { [k: string]: string } = {
      'caro': 'badge--rojo', 'normal': 'badge--azul', 'economico': 'badge--verde'
    };
    return map[precio?.toLowerCase()] ?? 'badge--gris';
  }

  getNivelBarWidth(nivel: string): string {
    const map: { [k: string]: string } = { 'alto': '90%', 'medio': '55%', 'bajo': '25%' };
    return map[nivel?.toLowerCase()] ?? '50%';
  }

  getNivelBarColor(nivel: string): string {
    const map: { [k: string]: string } = {
      'alto': '#dc2626', 'medio': '#f59e0b', 'bajo': '#16a34a'
    };
    return map[nivel?.toLowerCase()] ?? '#9ca3af';
  }
getDuracionPct(): string {
  const horas = this.lugar?.duracion_horas ?? 0;
  const max = 8;
  const pct = Math.min((horas / max) * 100, 100);
  return `${pct}%`;
}

getDuracionDesc(): string {
  const h = this.lugar?.duracion_horas ?? 0;
  if (h <= 1) return 'Actividad corta, ideal para tarde';
  if (h <= 3) return 'Medio día, ritmo tranquilo';
  if (h <= 6) return 'Día completo de experiencia';
  return 'Experiencia inmersiva de varios días';
}


}

