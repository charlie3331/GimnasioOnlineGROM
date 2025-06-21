import { Component, AfterViewInit } from '@angular/core';Add commentMore actions
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { FooterComponent } from './components/footer/footer.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { RedesComponent } from './components/redes/redes.component';
import { ResponsablesComponent } from './components/responsables/responsables.component';
import { MatCardModule } from '@angular/material/card';
import { VideoCardsComponent } from './components/video-cards/video-cards.component';
import { EjerciciosComponent } from './components/ejercicios/ejercicios.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { ContraValidator } from '../validators/contra.validator';
import { matchContra } from '../validators/match-contra.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    NavbarComponent,
    CarruselComponent,
    FooterComponent,
    UbicacionComponent,
    NosotrosComponent,
    ServiciosComponent,
    RedesComponent,
    ResponsablesComponent,
    MatCardModule,
    VideoCardsComponent,
    EjerciciosComponent,
    DashboardComponent,
    CapitalizarPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'practicaLibreria';

  ngAfterViewInit(): void {
    document.body.classList.remove('modo-accesible');

    const toggleBtn = document.getElementById('accesibilidad-toggle');
    const icono = document.getElementById('icono-accesibilidad');

    if (toggleBtn && icono) {
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('modo-accesible');
        const modo = document.body.classList.contains('modo-accesible');
        icono.textContent = modo ? '🌙' : '☀️';
      });
    }
  }
}