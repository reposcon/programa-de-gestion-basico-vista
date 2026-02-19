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

  getColumns(module: 'products' | 'users' | 'categories' | 'subcategories' | 'customers' | 'cash_sessions' | 'sales') {
    const configs = {
      products: [
        { key: 'id_product', label: 'ID', type: 'text' },
        { key: 'name_product', label: 'Nombre', type: 'text' },
        { key: 'category_info', label: 'Categoría / Subcategoría', type: 'custom_product' },
        { key: 'stock_product', label: 'Stock', type: 'stock' },
        { key: 'price_product', label: 'Precio', type: 'currency' },
        { key: 'state_product', label: 'Estado', type: 'badge' }
      ],
      users: [
        { key: 'id_user', label: 'ID', type: 'text' },
        { key: 'name_user', label: 'Nombre', type: 'text' },
        { key: 'name_role', label: 'Rol', type: 'badge_flat' }, 
        { key: 'state_user', label: 'Estado', type: 'badge' }
      ],
      categories: [
        { key: 'id_category', label: 'ID', type: 'text' },
        { key: 'name_category', label: 'Categoría', type: 'text' },
        { key: 'state_category', label: 'Estado', type: 'badge' }
      ],
      subcategories: [
        { key: 'id_subcategory', label: 'ID', type: 'text' },
        { key: 'name_subcategory', label: 'Nombre', type: 'text' },
        { key: 'name_category', label: 'Categoría', type: 'badge_flat' },
        { key: 'state_subcategory', label: 'Estado', type: 'badge' }
      ],
      customers: [
        { key: 'name_customer', label: 'Nombre', type: 'text' },
        { key: 'document_number_customer', label: 'Documento', type: 'text' },
        { key: 'email_customer', label: 'Email', type: 'text' },
        { key: 'phone_customer', label: 'Teléfono', type: 'text' },
        { key: 'state_customer', label: 'Estado', type: 'badge' }
      ],
      cash_sessions: [
        { key: 'id', label: 'ID', type: 'text' },
        { key: 'opened_at', label: 'Apertura', type: 'text' },
        { key: 'user_name', label: 'Cajero', type: 'text' },
        { key: 'opening_amount', label: 'Base', type: 'currency' },
        { key: 'closing_amount', label: 'Ventas', type: 'currency' },
        { key: 'status', label: 'Estado', type: 'badge_status' } 
      ],
      sales: [
        { key: 'invoice_number', label: 'N° Factura', type: 'text' },
        { key: 'created_at', label: 'Fecha / Hora', type: 'text' },
        { key: 'customer_name', label: 'Cliente', type: 'text' },
        { key: 'total_sale', label: 'Total', type: 'currency' }
      ]
    };
    return configs[module];
  }
}