import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../services/api';

interface Hotel { id_hotel: number; id_destino: number; nom_hotel: string; precio_noche: number; }
interface Restaurante { id_restaurante: number; id_destino: number; nom_restaurante: string; precio_promedio: number; }
interface Actividad { id_actividad: number; id_destino: number; nom_actividad: string; precio_actividad: number; }

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viajes.html',
  styleUrl: './viajes.css'
})
export class Viajes implements OnInit {
  viajeForm!: FormGroup;
  destinos: any[] = [];
  viajesRegistrados: any[] = []; // Para la tabla de viajes guardados

  hotelesFiltrados: Hotel[] = [];
  restaurantesFiltrados: Restaurante[] = [];
  actividadesFiltradas: Actividad[] = [];

  ciudadesColombia = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta'];
  mostrarFormulario = false;
  cargandoViajes = true; // Controla el spinner de la lista

  constructor(private fb: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatosIniciales();
  }

  inicializarFormulario(): void {
    this.viajeForm = this.fb.group({
      id_destino: ['', Validators.required],
      ciudad_origen: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      costo_transporte: [0],
      costo_hospedaje: [0],
      costo_comidas: [0],
      costo_actividades: [0],
      costo_total: [{ value: 0, disabled: true }],
      viajeros: this.fb.array([this.crearViajero()]) // Inicializa con un viajero
    });

    // Escuchar cambio de destino para filtrar
    this.viajeForm.get('id_destino')?.valueChanges.subscribe(id => {
      if (id) this.filtrarServicios(Number(id));
    });
  }

  get viajeros(): FormArray {
    return this.viajeForm.get('viajeros') as FormArray;
  }

  crearViajero(): FormGroup {
    return this.fb.group({
      nombre_completo: ['', Validators.required],
      gasto_pagado: [0],
      gasto_asignado: [0]
    });
  }

  agregarViajero(): void {
    this.viajeros.push(this.crearViajero());
  }

  eliminarViajero(i: number): void {
    this.viajeros.removeAt(i);
  }

  cargarDatosIniciales(): void {
    this.api.getDestinos().subscribe(data => this.destinos = data as any[]);
    this.api.getViajes().subscribe({
      next: (data) => {
        this.viajesRegistrados = data as any[];
        this.cargandoViajes = false; // Quita el spinner
      },
      error: () => this.cargandoViajes = false
    });
  }

  filtrarServicios(id: number): void {
    this.api.getHoteles().subscribe(data => {
      this.hotelesFiltrados = (data as Hotel[]).filter(h => h.id_destino === id);
    });
    this.api.getRestaurantes().subscribe(data => {
      this.restaurantesFiltrados = (data as Restaurante[]).filter(r => r.id_destino === id);
    });
    this.api.getActividades().subscribe(data => {
      this.actividadesFiltradas = (data as Actividad[]).filter(a => a.id_destino === id);
    });
  }

  actualizarPrecio(event: any, tipo: string): void {
    const id = Number(event.target.value);
    if (tipo === 'hotel') {
      const h = this.hotelesFiltrados.find(x => x.id_hotel === id);
      this.viajeForm.patchValue({ costo_hospedaje: h ? h.precio_noche : 0 });
    } else if (tipo === 'rest') {
      const r = this.restaurantesFiltrados.find(x => x.id_restaurante === id);
      this.viajeForm.patchValue({ costo_comidas: r ? r.precio_promedio : 0 });
    } else if (tipo === 'act') {
      const a = this.actividadesFiltradas.find(x => x.id_actividad === id);
      this.viajeForm.patchValue({ costo_actividades: a ? a.precio_actividad : 0 });
    }
    this.calcularTotal();
  }

  calcularTotal(): void {
    const f = this.viajeForm.getRawValue();
    const total = Number(f.costo_transporte || 0) + Number(f.costo_hospedaje || 0) +
      Number(f.costo_comidas || 0) + Number(f.costo_actividades || 0);
    this.viajeForm.patchValue({ costo_total: total });
  }

  guardarViaje(): void {
    if (this.viajeForm.valid) {
      const rawData = this.viajeForm.getRawValue();

      // CALCULAR num_dias (Diferencia entre fechas)
      const inicio = new Date(rawData.fecha_inicio);
      const fin = new Date(rawData.fecha_fin);
      const dif = fin.getTime() - inicio.getTime();
      const dias = Math.ceil(dif / (1000 * 3600 * 24)) + 1; // +1 para incluir el día de salida

      const datosViaje = {
        id_destino: Number(rawData.id_destino),
        ciudad_origen: rawData.ciudad_origen,
        fecha_inicio: rawData.fecha_inicio,
        fecha_fin: rawData.fecha_fin,
        num_dias: dias, // <--- AHORA SÍ COINCIDE CON TU SQL
        distancia: 0,   // Valor por defecto para que no falle
        estilo_viaje: 'Estándar', // O el valor que quieras por defecto
        costo_transporte: Number(rawData.costo_transporte || 0),
        costo_hospedaje: Number(rawData.costo_hospedaje || 0),
        costo_comidas: Number(rawData.costo_comidas || 0),
        costo_actividades: Number(rawData.costo_actividades || 0),
        costo_total: Number(rawData.costo_total || 0)
      };

      this.api.crearViaje(datosViaje).subscribe({
        next: (viajeGuardado: any) => {
          const idGenerado = viajeGuardado.id_viaje || viajeGuardado.id;

          this.guardarViajeros(idGenerado, rawData.viajeros);
        },
        error: (err) => alert('Error al crear el viaje maestro')
      });
    }
  }

  private guardarViajeros(idViaje: number, listaViajeros: any[]): void {
  listaViajeros.forEach(viajero => {
    // Calculamos el saldo antes de enviar
    const pagado = Number(viajero.gasto_pagado || 0);
    const asignado = Number(viajero.gasto_asignado || 0);
    const saldoCalculado = asignado - pagado;

    const objetoViajero = {
      id_viaje: idViaje, 
      nom_viajero: viajero.nombre_completo, 
      gasto_pagado: pagado,
      gasto_asignado: asignado,
      saldo: saldoCalculado 
    };

    this.api.crearViajero(objetoViajero).subscribe({
      next: () => console.log(`Viajero ${objetoViajero.nom_viajero} guardado`),
      error: (e) => {
        console.error('Error al guardar viajero:', e);
        alert(`No se pudo guardar al viajero: ${objetoViajero.nom_viajero}`);
      }
    });
  });

  alert('¡Viaje y viajeros registrados correctamente!');
  this.finalizarProceso();
}

  private finalizarProceso(): void {
    this.viajeForm.reset();
    this.inicializarFormulario();
    this.cargarDatosIniciales();
    this.mostrarFormulario = false;
  }

  toggleForm() { this.mostrarFormulario = !this.mostrarFormulario; }

  eliminarViajeRegistrado(idViaje: number): void {
  if (confirm('¿Estás seguro de eliminar este viaje? Se perderán todos los datos de los viajeros asociados.')) {
        this.api.borrarViaje(idViaje).subscribe({
      next: () => {
        alert('Viaje eliminado con éxito');
                this.cargarDatosIniciales(); 
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el viaje. Revisa la consola para más detalles.');
      }
    });
  }
}
}