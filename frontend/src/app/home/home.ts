import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('destinosTrack') destinosTrack!: ElementRef;
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroSub') heroSub!: ElementRef;
  @ViewChild('heroSearch') heroSearch!: ElementRef;
  @ViewChild('heroPills') heroPills!: ElementRef;
  @ViewChildren('hotelesGrid') hotelesGrid!: QueryList<ElementRef>;
  @ViewChild('bannerRef') bannerRef!: ElementRef;

  tipos = [
    { label: 'Destinos', valor: 'destino' },
    { label: 'Hoteles', valor: 'hotel' },
    { label: 'Restaurantes', valor: 'restaurante' },
    { label: 'Actividades', valor: 'actividad' },
  ];

  tipoActivo = '';
  busqueda = '';
  destinos: any[] = [];
  hoteles: any[] = [];
  cargandoDestinos = true;
  cargandoHoteles = true;
  private scrollTween: any;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.getDestinos().subscribe({
      next: (data: any) => {
        this.destinos = [...data, ...data];
        this.cargandoDestinos = false;
        this.cdr.detectChanges();
        setTimeout(() => this.iniciarCarrusel(), 100);
      },
      error: () => { this.cargandoDestinos = false; this.cdr.detectChanges(); }
    });

    this.api.getHoteles().subscribe({
      next: (data: any) => {
        this.hoteles = data;
        this.cargandoHoteles = false;
        this.cdr.detectChanges();
        setTimeout(() => this.animarScrollSections(), 200);
      },
      error: () => { this.cargandoHoteles = false; this.cdr.detectChanges(); }
    });
  }

  ngAfterViewInit() {
    this.animarHero();
  }

  // ANIMACION 1: Hero reveal al cargar
  animarHero() {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.hero-title',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.hero-sub',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo('.search-bar',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.tipo-pill',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 },
      '-=0.2'
    );
  }

  // ANIMACION 2: Fade + slide up al hacer scroll
  animarScrollSections() {
    gsap.utils.toArray('.hotel-card').forEach((card: any, i: number) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    gsap.fromTo('.banner-restaurantes',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.banner-restaurantes',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // ANIMACION 3: Carrusel auto-scroll
  iniciarCarrusel() {
    const track = this.destinosTrack?.nativeElement;
    if (!track) return;

    const mitad = track.scrollWidth / 2;

    this.scrollTween = gsap.to(track, {
      x: -mitad,
      duration: 45,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % mitad)
      }
    });
  }

  cambiarTipo(tipo: string) {
    this.tipoActivo = tipo;
    this.router.navigate(['/buscar'], { queryParams: { tipo } });
  }

  filtrar() {
    if (this.busqueda.trim().length > 1) {
      this.router.navigate(['/buscar'], { queryParams: { q: this.busqueda } });
    }
  }

  getImagenHotel(hotel: any): string {
    const imagenes: any = {
      'Hotel Sofitel Legend Santa Clara': 'https://media-cdn.tripadvisor.com/media/photo-s/1a/f1/9b/b1/hotel-casa-la-fe.jpg',
      'Hotel Caribe Cartagena': 'https://a.otcdn.com/imglib/hotelphotos/7/8/026/hotel-dann-carlton-cali-20240509175854888700.webp',
      'Hotel Casa San Agustin': 'https://hotelesdann.com/wp-content/uploads/2020/04/Carlton-Medellin.jpg'
    };
    return imagenes[hotel.nom_hotel] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
  }

  getImagenDestino(destino: any): string {
    const imagenes: any = {
      1: 'https://mlqfmr3rpryd.i.optimole.com/cb:JBSP.a525/w:1024/h:814/q:100/ig:avif/https://cartagena-tours.co/wp-content/uploads/2023/12/49806996192_ec0e5e29b1_b.jpg',
      2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4pdH6YZEBNdh5H_duICf9XhMj-ZYL_3yUHA&s',
      3: 'https://xixerone.com/wp-content/uploads/2019/03/Qu%C3%A9-hacer-en-El-Poblado-Medell%C3%ADn.jpg',
      4: 'https://cuponassets.cuponatic-latam.com/backendCo/uploads/imagenes_descuentos/200487/2d50792594dbd7b5f203cb0f5c57cd6f3a9648f8.XL2.jpg',
      5: 'https://cdn.prod.website-files.com/6585634ed93b5382ccf3e62b/658564810def56dc653d3d8b_shutterstock_772790296%2B%25281%2529.jpeg'
    };
    return imagenes[destino.id_destino] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600';
  }
}