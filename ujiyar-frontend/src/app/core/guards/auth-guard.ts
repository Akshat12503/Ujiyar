import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if our service has a current user loaded
  if (authService.currentUserValue) {
    return true; // Let them pass!
  }

  // If not logged in, kick them back to the login page
  router.navigate(['/auth/login']);
  return false; 
};