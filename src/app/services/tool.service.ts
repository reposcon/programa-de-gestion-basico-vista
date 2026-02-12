import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export interface ConfirmOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private updateSubject = new Subject<void>();

  update$ = this.updateSubject.asObservable();

  notifyUpdate() {
    this.updateSubject.next();
  }

  confirm(options: ConfirmOptions): Promise<boolean> {
    return Swal.fire({
      title: options.title ?? '¿Estás seguro?',
      text: options.text ?? 'Esta acción no se puede deshacer',
      icon: options.icon ?? 'warning',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: options.confirmText ?? 'Confirmar',
      cancelButtonText: options.cancelText ?? 'Cancelar',
      reverseButtons: true,
      backdrop: `rgba(0,0,0,0.4) blur(4px)`
    }).then(result => result.isConfirmed);
  }


}
