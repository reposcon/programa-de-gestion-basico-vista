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

  getColumns(module: 'products' | 'users' | 'categories' | 'subcategories') {
    const configs = {
      products: [
        { key: 'id_product', label: 'ID', type: 'text' },
        { key: 'name_product', label: 'Nombre', type: 'text' },
        { key: 'category_info', label: 'Categoría / Subcategoría', type: 'custom_product' },
        { key: 'stock_product', label: 'Stock', type: 'stock' },
        { key: 'price_product', label: 'Precio', type: 'currency' },
        { key: 'state_product', label: 'Estado', type: 'badge' }
      ],
      // En tool.service.ts -> getColumns
      users: [
        { key: 'id_user', label: 'ID', type: 'text' },
        { key: 'name_user', label: 'Nombre', type: 'text' },
        { key: 'name_role', label: 'Rol', type: 'badge_flat' }, // Usamos el badge azul para el rol
        { key: 'state_user', label: 'Estado', type: 'badge' }
      ],
      categories: [
        { key: 'id_category', label: 'ID', type: 'text' },
        { key: 'name_category', label: 'Categoría', type: 'text' },
        { key: 'state_category', label: 'Estado', type: 'badge' }
      ],
      // En tool.service.ts
      subcategories: [
        { key: 'id_subcategory', label: 'ID', type: 'text' },
        { key: 'name_subcategory', label: 'Nombre', type: 'text' },
        { key: 'name_category', label: 'Categoría', type: 'badge_flat' }, // Un tipo nuevo para el estilo azul
        { key: 'state_subcategory', label: 'Estado', type: 'badge' }
      ],
      // Dentro de getColumns en ToolService...
      customers: [
        { key: 'id_customer', label: 'ID', type: 'text' },
        { key: 'document_number', label: 'Documento', type: 'text' },
        { key: 'name_customer', label: 'Cliente', type: 'text' },
        { key: 'phone_customer', label: 'Teléfono', type: 'text' },
        { key: 'state_customer', label: 'Estado', type: 'badge' }
      ]
    };
    return configs[module];
  }
}