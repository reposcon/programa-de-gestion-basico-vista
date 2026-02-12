import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiMessageService } from '../../services/ui-message.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private uiMessage: UiMessageService
  ) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.uiMessage.show('Debes iniciar sesión para acceder', 'info');
      return false;
    }

    if (user.rol !== 'admin') {
      this.uiMessage.show(
        'No puedes acceder a esta sección porque no tienes permisos',
        'warning'
      );
      return false;
    }

    return true;
  }
}
