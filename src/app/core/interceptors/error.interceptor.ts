import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiMessageService } from '../../services/ui-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private uiMessage: UiMessageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          this.uiMessage.show('Tu sesión expiró. Inicia sesión nuevamente');
          this.authService.logout();
        }

        if (error.status === 403) {
          this.uiMessage.show('No tienes permisos para acceder a este recurso');
        }

        if (error.status === 500) {
          this.uiMessage.show('Error interno del servidor');
        }

        if (error.status === 0) {
          this.uiMessage.show('No se pudo conectar con el servidor');
        }

        return throwError(() => error);
      })
    );
  }
}
