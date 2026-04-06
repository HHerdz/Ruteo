import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clima.html',
  styleUrl: './clima.css'
})
export class ClimaComponent implements OnChanges {

  @Input() latitud: number = 0;
  @Input() longitud: number = 0;
  @Input() nombreDestino: string = '';

  clima: any = null;
  cargando: boolean = false;
  error: boolean = false;

  private codigosClima: { [key: number]: { descripcion: string; icono: string } } = {
    0:  { descripcion: 'Despejado',        icono: '☀️' },
    1:  { descripcion: 'Mayormente despejado', icono: '🌤️' },
    2:  { descripcion: 'Parcialmente nublado', icono: '⛅' },
    3:  { descripcion: 'Nublado',          icono: '☁️' },
    45: { descripcion: 'Niebla',           icono: '🌫️' },
    48: { descripcion: 'Niebla con escarcha', icono: '🌫️' },
    51: { descripcion: 'Llovizna leve',    icono: '🌦️' },
    61: { descripcion: 'Lluvia leve',      icono: '🌧️' },
    63: { descripcion: 'Lluvia moderada',  icono: '🌧️' },
    65: { descripcion: 'Lluvia fuerte',    icono: '🌧️' },
    80: { descripcion: 'Chubascos',        icono: '🌦️' },
    95: { descripcion: 'Tormenta',         icono: '⛈️' },
  };

  ngOnChanges(changes: SimpleChanges) {
    if (this.latitud && this.longitud) {
      this.consultarClima();
    }
  }

  consultarClima() {
    this.cargando = true;
    this.error = false;
    this.clima = null;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitud}&longitude=${this.longitud}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature&timezone=auto&forecast_days=1`;

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta');
        return response.json();
      })
      .then(data => {
        const cw = data.current_weather;
        const humedad = data.hourly?.relative_humidity_2m?.[0] ?? '--';
        const sensacion = data.hourly?.apparent_temperature?.[0] ?? '--';
        const info = this.codigosClima[cw.weathercode] ?? { descripcion: 'Variable', icono: '🌡️' };

        this.clima = {
          temperatura: Math.round(cw.temperature),
          sensacion: Math.round(sensacion),
          humedad,
          descripcion: info.descripcion,
          icono: info.icono,
          viento: Math.round(cw.windspeed),
          esNoche: cw.is_day === 0
        };
        this.cargando = false;
      })
      .catch(() => {
        this.error = true;
        this.cargando = false;
      });
  }
}