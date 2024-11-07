import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { authGuard, isAdminGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
    data: { state: 'landing' },
  },
  { path: 'login', component: LoginComponent, data: { state: 'login' } },
  { path: 'register', component: RegisterComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { state: 'home' },
  },
  { path: 'landing', component: LandingComponent, data: { state: 'landing' } },
  {
    path: 'info',
    loadComponent: () =>
      import('./pages/my-information/my-information.component').then(
        (m) => m.MyInformationComponent
      ),
    canActivate: [authGuard],
    data: { state: 'info' },
  },
  {
    path: 'turnos',
    loadComponent: () =>
      import('./pages/turnos/turnos.component').then((m) => m.TurnosComponent),
    data: { state: 'turnos' },
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
    data: { state: 'users' },
    canActivate: [authGuard, isAdminGuard],
  },
  { path: '**', component: NotFoundComponent, data: { state: 'notfound' } },
];
