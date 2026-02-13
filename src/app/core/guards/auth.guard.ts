import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state_user) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; 
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};