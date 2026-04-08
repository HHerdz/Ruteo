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
  private routeSub: any; 

  private imagenesMap: { [key: string]: string[] } = {

    // ================= DESTINOS =================
    'Ciudad Amurallada': [
      'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200',
      'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=1200',
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200',
      'https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=1200'
    ],

    'Cali Centro Histórico': [
      'https://images.unsplash.com/photo-1597092404773-9f4e6b9b2a6d?w=1200',
      'https://images.unsplash.com/photo-1626110585745-1c7c3f6f6f52?w=1200',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
    ],

    'El Poblado': [
      'https://images.unsplash.com/photo-1620050752110-39f5c91d6b58?w=1200',
      'https://images.unsplash.com/photo-1611159063981-b8c8c4301869?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200'
    ],

    'Pozo Azul de Paipa': [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
    ],

    'Isla de San Andrés': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],

    // ================= HOTELES =================
    'Hotel Sofitel Legend Santa Clara': [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Caribe Cartagena': [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200'
    ],

    'Hotel Casa San Agustin': [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Dann Cartagena': [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200'
    ],

    'Hotel Ibis Cartagena': [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'InterContinental Cali': [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Spiwak Chipichape': [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'NH Cali Royal': [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Dann Carlton Cali': [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200'
    ],

    'Hotel Ibis Cali Granada': [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel The Charlee': [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'
    ],

    'Hotel Dann Carlton Medellin': [
      'https://images.unsplash.com/photo-1551776235-dde6d4829808?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200'
    ],

    'Hotel Click Clack': [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Diez': [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Ibis Medellin': [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'Hotel Sochagota': [
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb2101d?w=1200',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200'
    ],

    'Estelar Paipa Hotel Spa': [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200'
    ],

    'D’Acosta Hotel Sochagota': [
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb2101d?w=1200',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200'
    ],

    'Hotel Termales El Batán': [
      'https://images.unsplash.com/photo-1501117716987-c8e1ecb2101d?w=1200',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200'
    ],

    'Hotel Cabañas El Portón': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
    ],

    'Decameron Isleño': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],

    'Hotel Casablanca': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],

    'GHL Relax Sunrise': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],

    'Hotel Arena Blanca': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200'
    ],

    'Posada Nativa Miss Mary': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
    ],

    // ================= RESTAURANTES =================
    'La Cevichería': [
      'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=1200',
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Carmen Cartagena': [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'La Mulata': [
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200'
    ],

    'Marea Restaurante': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'Di Silvio Trattoria': [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200'
    ],

    'Ringlete': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Platillos Voladores': [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Antigua Contemporánea': [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'El Zaguan de San Antonio': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Piazza by Storia D’Amore': [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200'
    ],

    'Carmen Medellin': [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'Mondongos': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'El Cielo': [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'Hato Viejo': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Pergamino Café': [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200'
    ],

    'El Pesebre': [
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'La Estación': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Brasas y Leños': [
      'https://images.unsplash.com/photo-1558030006-450675393462?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200'
    ],

    'El Balcón Boyacense': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Restaurante Lago Sochagota': [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200'
    ],

    'Miss Celia': [
      'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=1200',
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'La Regatta': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'Capitán Mandy': [
      'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=1200',
      'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200'
    ],

    'Sea Watch Café': [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'
    ],

    'Donde Francesca': [
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200'
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
  ) { }

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
      error: () => { }
    });
  }

  async animar() {
    const gsap = await import('gsap').then(m => m.default); // ✅ import directo
    setTimeout(() => {
      gsap.from('.corp-sidebar', { opacity: 0, x: -24, duration: 0.55, ease: 'power3.out' });
      gsap.from('.corp-main', { opacity: 0, y: 24, duration: 0.55, delay: 0.1, ease: 'power3.out' });
      gsap.from('.corp-section', { opacity: 0, y: 16, duration: 0.4, stagger: 0.08, delay: 0.25, ease: 'power2.out' });
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
    if (this.tipo === 'hotel') return this.lugar?.nom_hotel ?? '';
    if (this.tipo === 'restaurante') return this.lugar?.nom_restaurante ?? '';
    if (this.tipo === 'actividad') return this.lugar?.nom_actividad ?? '';
    return this.lugar?.nom_destino ?? '';
  }

  getCategoria(): string {
    if (this.tipo === 'hotel') return this.lugar?.categoria ?? 'Hotel';
    if (this.tipo === 'restaurante') return this.lugar?.tipo_cocina ?? 'Restaurante';
    if (this.tipo === 'actividad') return this.lugar?.tipo ?? 'Actividad';
    return this.lugar?.tipo_destino ?? 'Destino';
  }

  getDescripcion(): string { return this.lugar?.descripcion ?? 'Sin descripción disponible'; }

  getPrecio(): number {
    if (this.tipo === 'hotel') return this.lugar?.precio_noche ?? 0;
    if (this.tipo === 'restaurante') return this.lugar?.precio_promedio ?? 0;
    if (this.tipo === 'actividad') return this.lugar?.costo ?? 0;
    return 0;
  }

  getTipoUnidad(): string {
    if (this.tipo === 'hotel') return 'por noche';
    if (this.tipo === 'restaurante') return 'promedio';
    if (this.tipo === 'actividad') return 'por persona';
    return '';
  }

  getRating(): number {
    if (this.tipo === 'hotel') return this.lugar?.estrellas ?? 0;
    return 5;
  }

  getDatosGenerales(): any[] {
    if (this.tipo === 'hotel') return [
      { icon: '⭐', label: 'Calificación', value: `${this.lugar?.estrellas ?? 0} / 5` },
      { icon: '🏷️', label: 'Categoría', value: this.lugar?.categoria ?? 'N/A' },
      { icon: '📞', label: 'Teléfono', value: this.lugar?.telefono ?? 'N/A' },
      { icon: '🌐', label: 'Web', value: this.lugar?.sitio_web ?? 'N/A' }
    ];
    if (this.tipo === 'restaurante') return [
      { icon: '🍽️', label: 'Tipo de Cocina', value: this.lugar?.tipo_cocina ?? 'N/A' },
      { icon: '🏷️', label: 'Categoría', value: this.lugar?.categoria ?? 'N/A' },
      { icon: '🕐', label: 'Horario', value: this.lugar?.horario ?? 'N/A' },
      { icon: '📞', label: 'Teléfono', value: this.lugar?.telefono ?? 'N/A' }
    ];
    if (this.tipo === 'actividad') return [
      { icon: '🏷️', label: 'Tipo', value: this.lugar?.tipo ?? 'N/A' },
      { icon: '⏱️', label: 'Duración', value: `${this.lugar?.duracion_horas ?? 0} horas` },
      { icon: '🧭', label: 'Incluye guía', value: this.lugar?.incluye_guia ? 'Sí' : 'No' },
      { icon: '✅', label: 'Disponible', value: this.lugar?.activo ? 'Sí' : 'No' }
    ];
    return [
      { icon: '📍', label: 'Tipo', value: this.lugar?.tipo_destino ?? 'N/A' },
      { icon: '✅', label: 'Estado', value: this.lugar?.activo ? 'Activo' : 'Inactivo' }
    ];
  }

  getDetallesExtra(): any[] {
    if (this.tipo === 'hotel') return [
      { label: 'Precio por Noche', value: `$${this.lugar?.precio_noche ?? 0}` },
      { label: 'Sitio Web', value: `<a href="https://${this.lugar?.sitio_web}" target="_blank">${this.lugar?.sitio_web}</a>` }
    ];
    if (this.tipo === 'restaurante') return [
      { label: 'Precio Promedio', value: `$${this.lugar?.precio_promedio ?? 0}` },
      { label: 'Horario de Atención', value: this.lugar?.horario ?? 'N/A' }
    ];
    if (this.tipo === 'actividad') return [
      { label: 'Costo', value: this.lugar?.costo > 0 ? `$${this.lugar?.costo}` : 'Gratis' },
      { label: 'Duración', value: `${this.lugar?.duracion_horas ?? 0} horas` },
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

