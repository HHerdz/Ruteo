import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.HomeComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'buscar', loadComponent: () => import('./buscar/buscar').then(m => m.BuscarComponent) },
  { path: 'detalle/:tipo/:id', loadComponent: () => import('./detalle/detalle').then(m => m.DetalleComponent) },
  { path: 'comparar', loadComponent: () => import('./comparar/comparar').then(m => m.CompararComponent) },
  { path: 'presupuesto', loadComponent: () => import('./presupuesto/presupuesto').then(m => m.PresupuestoComponent) },
  { path: 'gastos', loadComponent: () => import('./gastos/gastos').then(m => m.GastosComponent) },
  { path: 'checklist', loadComponent: () => import('./checklist/checklist').then(m => m.ChecklistComponent) },
  { path: 'recomendaciones', loadComponent: () => import('./recomendaciones/recomendaciones').then(m => m.RecomendacionesComponent) }
];