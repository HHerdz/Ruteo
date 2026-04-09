import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  constructor(public router: Router, private auth: AuthService) {}

  esHome(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  estaLogueado(): boolean {
    return this.auth.estaLogueado();
  }

  cerrarSesion(): void {
    this.auth.logout().subscribe({
      next: () => this.finalizar(),
      error: () => this.finalizar()
    });
  }

  private finalizar(): void {
    this.auth.limpiarTokens();
    this.router.navigate(['/home']);
  }
}