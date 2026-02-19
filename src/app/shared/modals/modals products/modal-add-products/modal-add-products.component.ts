import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductServiceService } from '../../../../services/product-service.service';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

@Component({
  selector: 'app-modal-add-products',
  standalone: false,
  templateUrl: './modal-add-products.component.html',
  styleUrl: './modal-add-products.component.css'
})
export class ModalAddProductComponent {
  @Input() categories: any[] = [];
  @Input() subcategories: any[] = [];
  @Input() taxes: any[] = [];
  @Output() onSave = new EventEmitter<string>();

  prod: any = { 
    name_product: '', 
    category_id: null, 
    subcategory_id: null, 
    state_product: 1,
    price_sell: 0,
    price_cost: 0,
    stock: 0,
    tax_id: null,
    is_tax_included: true
  };

  constructor(
    private productService: ProductServiceService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService
  ) { }

  get subcategoryActiveFiltered() {
    if (this.prod.category_id) {
      return this.subcategories.filter(
        (sub: any) => Number(sub.category_id) === Number(this.prod.category_id)
      );
    }
    return [];
  }

  save(): void {
    if (!this.prod.name_product || !this.prod.category_id || !this.prod.subcategory_id || !this.prod.tax_id) {
      this.uiMessage.show('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    const dataToSave = {
      name_product: this.prod.name_product,
      category_id: Number(this.prod.category_id),
      subcategory_id: Number(this.prod.subcategory_id),
      price_sell: Number(this.prod.price_sell),
      price_cost: Number(this.prod.price_cost),
      stock: Number(this.prod.stock),
      tax_id: Number(this.prod.tax_id),
      is_tax_included: this.prod.is_tax_included ? 1 : 0,
      state_product: Number(this.prod.state_product)
    };

    this.productService.create(dataToSave).subscribe({
      next: () => {
        this.uiMessage.show('Producto añadido correctamente', 'success');
        this.toolservice.notifyUpdate();
        this.resetForm();
        
        this.closeModalManually();
      },
      error: err => {
        this.uiMessage.show(
          err?.error?.message || 'Error al guardar el producto',
          'warning'
        );
      }
    });
  }

  private closeModalManually() {
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops[0]) {
      backdrops[0].parentNode?.removeChild(backdrops[0]);
    }
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  resetForm() {
    this.prod = {
      name_product: '',
      category_id: null,
      subcategory_id: null,
      state_product: 1,
      price_sell: 0,
      price_cost: 0,
      stock: 0,
      tax_id: this.taxes.length > 0 ? this.taxes[0].id_tax : null,
      is_tax_included: true
    };
  }
}