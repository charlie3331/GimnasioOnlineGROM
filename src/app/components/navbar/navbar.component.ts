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

  userName: string | null = null;
  userRole: string | null = null;

  constructor(private authService: AuthServiceService,private authS: AuthService) {
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


  ngAfterViewInit(): void {}

  toggleMenuUsuario(): void {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
  }

  toggleMenu() {
    const menu = this.sideMenu.nativeElement as HTMLElement;
    const toggle = this.menuToggle.nativeElement as HTMLElement;

    if (menu.classList.contains('active')) {
      menu.classList.remove('active');
      toggle.style.display = 'flex';
    } else {
      menu.classList.add('active');
      toggle.style.display = 'none';
    }
  }

  cerrarSesion() {
    this.authService.logout(); 
  }

  logOut() {
    this.authS.cerrarSesion();
  }
}
