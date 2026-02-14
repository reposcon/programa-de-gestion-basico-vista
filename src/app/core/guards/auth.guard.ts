import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiMessageService } from '../../services/ui-message.service'; 
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const uiMessage = inject(UiMessageService); 

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        uiMessage.show('Debes iniciar sesión para acceder', 'info');
        router.navigate(['/login']);
        return false;
      }

      const requiredPermission = route.data['permission'];

      if (requiredPermission) {
        if (authService.hasPermission(requiredPermission)) {
          return true;
        } else {
          uiMessage.show('No tienes permisos para acceder a esta sección', 'warning');
          console.warn('Acceso denegado:', requiredPermission);
          router.navigate(['/home']); 
          return false;
        }
      }

      return true;
    })
  );
};