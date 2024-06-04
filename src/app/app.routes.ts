import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'landing', component: LandingComponent },
  // {
  //     path: 'quiensoy',
  //     loadComponent: () =>
  //       import('./pages/who-am-i/who-am-i.component').then(
  //         (m) => m.WhoAmIComponent
  //       ),
  //   },
  //   {
  //     path: 'juegos',
  //     children: [
  //       {
  //         path: '',
  //         loadComponent: () =>
  //           import('./pages/games/games.component').then((m) => m.GamesComponent),
  //       },
  //       {
  //         path: 'mayormenor',
  //         loadComponent: () =>
  //           import('./components/games/mayor-menor/mayor-menor.component').then(
  //             (m) => m.MayorMenorComponent
  //           ),
  //       },

  //     ],
  //     canActivate: [authGuard],
  //   },
  { path: '**', component: NotFoundComponent },
];
