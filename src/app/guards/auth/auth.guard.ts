import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isLoggedIn;
};

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.currentUser.rol === 'admin';
};
