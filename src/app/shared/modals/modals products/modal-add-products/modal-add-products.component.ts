import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductServiceService } from '../../../../services/product-service.service';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-add-products',
  standalone: false,
  templateUrl: './modal-add-products.component.html',
  styleUrl: './modal-add-products.component.css'
})

export class ModalAddProductComponent {
  @Input() categories: any[] = [];
  @Input() subcategories: any[] = [];
  @Output() onSave = new EventEmitter<string>();

  prod: any = { name_product: '', category_id: null, subcategory_id: null, state_product: 1 };

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
  const dataToSave = {
    name_product: this.prod.name_product,
    category_id: Number(this.prod.category_id),
    subcategory_id: Number(this.prod.subcategory_id),
    state_product: Number(this.prod.state_product)
  };

  this.productService.create(dataToSave).subscribe({
    next: () => {
      this.uiMessage.show('Producto añadido correctamente', 'success');
      this.toolservice.notifyUpdate();
      this.resetForm();
    },
    error: err => {
      this.uiMessage.show(
        err?.error?.message || 'Error al guardar el producto',
        'warning'
      );
      console.error('Error al crear producto', err);
      this.resetForm();
    }
  });
}


  resetForm() {
    this.prod = { name_product: '', category_id: null, subcategory_id: null, state_product: 1 };
  }

}
