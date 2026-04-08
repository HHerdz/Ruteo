import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.apiUrl + '/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { nom_user: string; password: string }) {
    return this.http.post<any>(`${this.url}/login`, credentials);
  }

  register(data: { nom_user: string; password: string; rol: string }) {
    return this.http.post<any>(`${this.url}/register`, data);
  }

  refresh() {
    const token = this.getRefreshToken();
    return this.http.post<any>(`${this.url}/refresh`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout() {
    const token = this.getToken();
    this.http.delete(`${this.url}/logout`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  guardarTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  estaLogueado(): boolean {
    return !!this.getToken();
  }
}