import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { CapitalizarPipe } from '../../pipes/capitalizar.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, CapitalizarPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit, OnInit {
  mostrarMenuUsuario: boolean = false;
  usuarioActual: string | null = null;


  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;

  

  userName: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthServiceService, private authS: AuthService) {
    this.authS.userName$.subscribe((name) => {
      this.userName = name;
    });

    this.authS.userRole$.subscribe((role) => {
      this.userRole = role;
      console.log('Rol del usuario:', role);
    });
  }

  ngOnInit() {
    this.usuarioActual = localStorage.getItem('usuarioActual');

    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }


ngAfterViewInit() {
  document.addEventListener('click', (event: MouseEvent) => {
    const menu = this.sideMenu.nativeElement;
    const toggle = this.menuToggle.nativeElement;

    const isClickInside = menu.contains(event.target as Node) || toggle.contains(event.target as Node);

    if (!isClickInside && menu.classList.contains('active')) {
      this.closeMenu();
    }
  });
}

  toggleMenuUsuario(): void {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  toggleMenu() {
  const menu = this.sideMenu.nativeElement as HTMLElement;
  const toggle = this.menuToggle.nativeElement as HTMLElement;
  const overlay = this.overlay.nativeElement as HTMLElement;

  const isActive = menu.classList.contains('active');

  if (isActive) {
    menu.classList.remove('active');
    overlay.style.display = 'none';
    toggle.style.display = 'flex';
  } else {
    menu.classList.add('active');
    overlay.style.display = 'block';
    toggle.style.display = 'none';
  }
}

closeMenu() {
  const menu = this.sideMenu.nativeElement as HTMLElement;
  const toggle = this.menuToggle.nativeElement as HTMLElement;
  const overlay = this.overlay.nativeElement as HTMLElement;

  menu.classList.remove('active');
  overlay.style.display = 'none';
  toggle.style.display = 'flex';
}

  cerrarSesion() {
    this.authService.logout();
  }

  logOut() {
    this.authS.cerrarSesion();
  }
}
