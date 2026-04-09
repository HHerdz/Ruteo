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

      // CARTAGENA
      'Hotel Sofitel Legend Santa Clara': 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'Hotel Caribe Cartagena': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      'Hotel Casa San Agustin': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
      'Hotel Dann Cartagena': 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
      'Hotel Ibis Cartagena': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',

      // CALI
      'InterContinental Cali': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      'Hotel Spiwak Chipichape': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864',
      'NH Cali Royal': 'https://images.unsplash.com/photo-1554995207-c18c203602cb',
      'Hotel Dann Carlton Cali': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
      'Hotel Ibis Cali Granada': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',

      // MEDELLIN
      'Hotel The Charlee': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6',
      'Hotel Dann Carlton Medellin': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      'Hotel Click Clack': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'Hotel Diez': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
      'Hotel Ibis Medellin': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',


      // PAIPA
      'Hotel Sochagota': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'Estelar Paipa Hotel Spa': 'https://images.unsplash.com/photo-1540541338287-41700207dee6',
      'D’Acosta Hotel Sochagota': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
      'Hotel Termales El Batán': 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
      'Hotel Cabañas El Portón': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',

      // SAN ANDRES
      'Decameron Isleño': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      'Hotel Casablanca': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
      'GHL Relax Sunrise': 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      'Hotel Arena Blanca': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
      'Posada Nativa Miss Mary': 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a'
    };

    return imagenes[hotel.nom_hotel] + '?w=800'
      || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
  }

  getImagenRestaurante(restaurante: any): string {
  const imagenes: any = {

    // CARTAGENA
    'La Cevichería': 'https://s3.amazonaws.com/takami.co/CACHE/images/brandcarouselimage/1e6e357ecefa4d0884d62478ec5396e9/ntwylar5lywkdjvtx5ffrb/30ad08a72aa6394488535f6e1351d4de.jpeg',
    'Carmen Cartagena': 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    'La Mulata': 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee',
    'Marea Restaurante': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'Di Silvio Trattoria': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',

    // CALI
    'Ringlete': 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
    'Platillos Voladores': 'https://images.unsplash.com/photo-1551218808-94e220e084d2',
    'Antigua Contemporánea': 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0',
    'El Zaguan de San Antonio': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    'Piazza by Storia D’Amore': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65',

    // MEDELLIN
    'Carmen Medellin': 'https://images.unsplash.com/photo-1559339352-11d035aa65de',
    'Mondongos': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'El Cielo': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
    'Hato Viejo': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    'Pergamino Café': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',

    // PAIPA
    'El Pesebre': 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
    'La Estación': 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee',
    'Brasas y Leños': 'https://images.unsplash.com/photo-1558030006-450675393462',
    'El Balcón Boyacense': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828',
    'Restaurante Lago Sochagota': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',

    // SAN ANDRES
    'Miss Celia': 'https://www.sanandresislas.com.co/wp-content/uploads/2024/03/9.png',
    'La Regatta': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    'Capitán Mandy': 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    'Sea Watch Café': 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    'Donde Francesca': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe'
  };

  return imagenes[restaurante.nom_restaurante] + '?w=800' 
    || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800';
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
      'Tour en chiva por la ciudad amurallada': 'https://media.tacdn.com/media/attractions-splice-spp-674x446/11/ec/ee/49.jpg',
      'Clase de salsa en el centro de Cali': 'https://laantorchamagacin.com/wp-content/uploads/2023/10/cali-en-salsa.jpg',
      'Tour en Metrocable línea L': 'https://d2yoo3qu6vrk5d.cloudfront.net/pulzo-lite/images-resized/PP3743591-h-o.jpg',
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