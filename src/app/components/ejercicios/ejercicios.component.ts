import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FiltroEjerciciosComponent } from '../filtro-ejercicios/filtro-ejercicios.component';

@Component({
  selector: 'app-ejercicios',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, FiltroEjerciciosComponent],
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css']
})
export class EjerciciosComponent implements OnInit {
  @Output() parteSeleccionada = new EventEmitter<string>();
  
  datosPorParte: any[] = [];
  datosFiltrados: any[] = [];
  columnas: string[] = ['nombre', 'series', 'repeticiones', 'equipo'];
  filtroActual: string = '';

  // Datos locales
  private datosLocales = {
    "datosPorParte": [
      {
        "parte": "Pecho",
        "ejercicios": [
          {
            "nombre": "Flexiones",
            "series": "4",
            "repeticiones": "12",
            "equipo": "Ninguno"
          },
          {
            "nombre": "Press de banca",
            "series": "4",
            "repeticiones": "10",
            "equipo": "Banca, barra"
          }
        ]
      },
      {
        "parte": "Espalda",
        "ejercicios": [
          {
            "nombre": "Pull-up",
            "series": "4",
            "repeticiones": "10",
            "equipo": "Barras"
          },
          {
            "nombre": "Remo con barra",
            "series": "4",
            "repeticiones": "12",
            "equipo": "Barra"
          }
        ]
      },
      {
        "parte": "Piernas",
        "ejercicios": [
          {
            "nombre": "Sentadillas",
            "series": "4",
            "repeticiones": "12",
            "equipo": "Ninguno"
          },
          {
            "nombre": "Prensa de pierna",
            "series": "4",
            "repeticiones": "10",
            "equipo": "Máquina"
          }
        ]
      }
    ]
  };

  constructor() {}

  ngOnInit(): void {
    this.datosPorParte = this.datosLocales.datosPorParte;
    this.datosFiltrados = [...this.datosPorParte]; 
  }

  seleccionarParte(parte: string): void {
    this.parteSeleccionada.emit(parte);
  }

  onFiltrarEjercicios(termino: string): void {
    this.filtroActual = termino.toLowerCase().trim();

    if (this.filtroActual === '') {
      this.datosFiltrados = [...this.datosPorParte];
    } else {
      // Filtrar por nombre de ejercicio O por parte del cuerpo
      this.datosFiltrados = this.datosPorParte.map(grupo => {
        // verifica si la parte coincide
        const parteCoincide = grupo.parte.toLowerCase().includes(this.filtroActual);
        
        // Filtra ejercicios por nombre
        const ejerciciosFiltrados = grupo.ejercicios.filter((ejercicio: any) =>
          ejercicio.nombre.toLowerCase().includes(this.filtroActual)
        );

        if (parteCoincide) {
          return {
            ...grupo,
            ejercicios: grupo.ejercicios 
          };
        }
        
        // si no coincide la parte pero hay ejercicios que coinciden, mostrar solo esos
        if (ejerciciosFiltrados.length > 0) {
          return {
            ...grupo,
            ejercicios: ejerciciosFiltrados
          };
        }

        // Si no hay coincidencias no incluir el grupo
        return null;
      }).filter(grupo => grupo !== null); // elimina grupos vacíos
    }
  }

  // resalta el texto de ejercicios
  resaltarTexto(texto: string, termino: string): string {
    if (!termino || termino.trim() === '') {
      return texto;
    }

    const regex = new RegExp(`(${termino})`, 'gi');
    return texto.replace(regex, '<mark style="background-color: #ff7f00; color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
  }

  // resalta el texto de las partes
  resaltarParte(parte: string, termino: string): string {
    if (!termino || termino.trim() === '') {
      return parte;
    }

    const regex = new RegExp(`(${termino})`, 'gi');
    return parte.replace(regex, '<mark style="background-color: #ff7f00; color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
  }
}