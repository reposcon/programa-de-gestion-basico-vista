import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // Hay usuario, puede pasar
      } else {
        // No hay usuario, lo mandamos al login y bloqueamos la ruta
        router.navigate(['/login']);
        return false;
      }
    })
  );
};