import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'buscar', loadComponent: () => import('./buscar/buscar').then(m => m.BuscarComponent), canActivate: [authGuard] },
  { path: 'detalle/:tipo/:id', loadComponent: () => import('./detalle/detalle').then(m => m.DetalleComponent), canActivate: [authGuard] },
  { path: 'comparar', loadComponent: () => import('./comparar/comparar').then(m => m.CompararComponent), canActivate: [authGuard] },
  { path: 'presupuesto', loadComponent: () => import('./presupuesto/presupuesto').then(m => m.PresupuestoComponent), canActivate: [authGuard] },
  { path: 'gastos', loadComponent: () => import('./gastos/gastos').then(m => m.GastosComponent), canActivate: [authGuard] },
  { path: 'checklist', loadComponent: () => import('./checklist/checklist').then(m => m.ChecklistComponent), canActivate: [authGuard] },
  { path: 'recomendaciones', loadComponent: () => import('./recomendaciones/recomendaciones').then(m => m.RecomendacionesComponent), canActivate: [authGuard] },
  { path: 'viajes', loadComponent: () => import('./viajes/viajes').then(m => m.Viajes), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
];