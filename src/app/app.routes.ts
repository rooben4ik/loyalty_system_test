import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'info',
    canActivate: [authGuard], 
    loadComponent: () => import('./pages/info/info.component').then(m => m.InfoComponent)
  },
  { path: '**', redirectTo: 'login' }
];
