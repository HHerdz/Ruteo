import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  tab: 'login' | 'register' = 'login';

  nom_user  = '';
  password  = '';
  error     = '';

  reg_user  = '';
  reg_pass  = '';
  reg_pass2 = '';
  reg_error = '';
  reg_ok    = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    gsap.from('.login-left', { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.login-divider', { scaleX: 0, duration: 0.6, delay: 0.3, ease: 'power2.out', transformOrigin: 'left' });
    gsap.from('.login-tabs', { y: 20, opacity: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' });
    gsap.from('.login-field', { y: 20, opacity: 0, duration: 0.5, delay: 0.6, stagger: 0.1, ease: 'power2.out' });
    gsap.from('.login-btn', { y: 10, opacity: 0, duration: 0.4, delay: 0.9, ease: 'power2.out' });
  }

  cambiarTab(t: 'login' | 'register') {
    this.tab      = t;
    this.error    = '';
    this.reg_error = '';
    this.reg_ok   = '';
    gsap.from('.form-panel', { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' });
  }

  ingresar() {
    this.error = '';
    this.auth.login({ nom_user: this.nom_user, password: this.password })
      .subscribe({
        next: (res) => {
          this.auth.guardarTokens(res.access_token, res.refresh_token);
          this.router.navigate(['/']);
        },
        error: () => {
          this.error = 'Usuario o contraseña incorrectos';
        }
      });
  }

  registrar() {
    this.reg_error = '';
    this.reg_ok    = '';

    if (!this.reg_user || !this.reg_pass) {
      this.reg_error = 'Completa todos los campos';
      return;
    }
    if (this.reg_pass !== this.reg_pass2) {
      this.reg_error = 'Las contraseñas no coinciden';
      return;
    }

    this.auth.register({ nom_user: this.reg_user, password: this.reg_pass, rol: 'user' })
      .subscribe({
        next: () => {
          this.reg_ok = 'Cuenta creada. Ya puedes iniciar sesión.';
          setTimeout(() => this.cambiarTab('login'), 1800);
        },
        error: (e) => {
          this.reg_error = e.status === 409 ? 'Ese usuario ya existe' : 'Error al crear la cuenta';
        }
      });
  }
}