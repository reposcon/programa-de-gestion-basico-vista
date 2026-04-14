import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UiMessageService } from '../../services/ui-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private uiMessage: UiMessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
            let errorMsg = 'Datos inválidos.';
            if (error.error && error.error.message) {
                errorMsg = error.error.message;
            } else if (error.error && error.error.errors) {
               const firstKey = Object.keys(error.error.errors)[0];
               errorMsg = error.error.errors[firstKey][0];
            }
            this.uiMessage.show('Atención: ' + errorMsg, 'warning');
        } else if (error.status >= 500) {
            this.uiMessage.show(error.error?.message || 'Ocurrió un error en el servidor.', 'danger');
        } else if (error.status === 401 || error.status === 403) {
            this.uiMessage.show('No tienes permiso para efectuar esto.', 'danger');
        }
        return throwError(() => error);
      })
    );
  }
}
