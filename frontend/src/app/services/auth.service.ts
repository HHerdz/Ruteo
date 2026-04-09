import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  nom_usuario?: string;
  email:        string;
  password:     string;
  rol:          string;
}

export interface LoginResponse {
  access_token:  string;
  refresh_token: string;
  token_type:    string;
  expires_in:    number;
  email:         string;
  nom_usuario:   string;
  rol:           string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, data);
  }

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.url}/register`, data);
  }

  refresh(): Observable<{ access_token: string }> {
    const token = localStorage.getItem('refresh_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<{ access_token: string }>(`${this.url}/refresh`, {}, { headers });
  }

  logout(): Observable<any> {
    const headers = this.authHeaders();
    return this.http.delete(`${this.url}/logout`, { headers });
  }

  guardarTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token',  access);
    localStorage.setItem('refresh_token', refresh);
  }

  guardarRol(rol: string): void {
    localStorage.setItem('rol', rol);
  }

  limpiarTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rol');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('access_token');
  }

  esAdmin(): boolean {
    return localStorage.getItem('rol') === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }
}