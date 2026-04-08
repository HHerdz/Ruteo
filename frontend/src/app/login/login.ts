import { Component, OnInit, NgZone } from '@angular/core';
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

  // ── Login ────────────────────────────────────────────────────────────────
  email = '';          // antes: nom_user
  password = '';
  error = '';

  // ── Registro ─────────────────────────────────────────────────────────────
  reg_nombre = '';        // nom_usuario (opcional en BD)
  reg_email = '';        // email (único, obligatorio)
  reg_pass = '';
  reg_pass2 = '';
  reg_error = '';
  reg_ok = '';

  constructor(private auth: AuthService, private router: Router, private zone: NgZone) { }

  ngOnInit() {
    gsap.from('.login-left', { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.login-divider', { scaleX: 0, duration: 0.6, delay: 0.3, ease: 'power2.out', transformOrigin: 'left' });
    gsap.from('.login-tabs', { y: 20, opacity: 0, duration: 0.5, delay: 0.4, ease: 'power2.out' });
    gsap.from('.login-field', { y: 20, opacity: 0, duration: 0.5, delay: 0.6, stagger: 0.1, ease: 'power2.out' });
    gsap.from('.login-btn', { y: 10, opacity: 0, duration: 0.4, delay: 0.9, ease: 'power2.out' });
  }

  cambiarTab(t: 'login' | 'register') {
    this.tab = t;
    this.error = '';
    this.reg_error = '';
    this.reg_ok = '';
    gsap.from('.form-panel', { y: 16, opacity: 0, duration: 0.4, ease: 'power2.out' });
  }

  // ── Iniciar sesión ────────────────────────────────────────────────────────
  ingresar() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Completa todos los campos';
      return;
    }

    this.auth.login({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          this.auth.guardarTokens(res.access_token, res.refresh_token);
          this.router.navigate(['/buscar']);
        },
        error: (e) => {
          setTimeout(() => {
            this.error = e.status === 401
              ? 'Email o contraseña incorrectos'
              : 'Error al conectar con el servidor';
          }, 0);
        }
      });
  }

  // ── Crear cuenta ──────────────────────────────────────────────────────────
  registrar() {
    this.reg_error = '';
    this.reg_ok = '';

    if (!this.reg_email || !this.reg_pass) {
      this.reg_error = 'El email y la contraseña son obligatorios';
      return;
    }
    if (!this.reg_email.includes('@')) {
      this.reg_error = 'Ingresa un email válido';
      return;
    }
    if (this.reg_pass !== this.reg_pass2) {
      this.reg_error = 'Las contraseñas no coinciden';
      return;
    }
    if (this.reg_pass.length < 6) {
      this.reg_error = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.auth.register({
      nom_usuario: this.reg_nombre || undefined,
      email: this.reg_email,
      password: this.reg_pass,
      rol: 'usuario'
    }).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.reg_ok = '¡Cuenta creada! Ya puedes iniciar sesión.';
        }, 0);
        setTimeout(() => this.cambiarTab('login'), 1800);
      },
      error: (e) => {
        setTimeout(() => {
          this.reg_error = e.status === 409
            ? 'Ese email ya está registrado'
            : 'Error al crear la cuenta';
        }, 0);
      }
    });
  }
}