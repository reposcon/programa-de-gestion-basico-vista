import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductServiceService } from '../../../../services/product-service.service';
import { Category } from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';
import { Product } from '../../../../models/product.model';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-edit-products',
  standalone: false,
  templateUrl: './modal-edit-products.component.html',
  styleUrl: './modal-edit-products.component.css'
})
export class ModalEditProductsComponent {

  @Input() productEdit: Partial<Product> = {};
  @Input() categories: Category[] = [];
  @Input() subcategories: Subcategory[] = [];
  @Input() taxes: any[] = []; // <--- AGREGAR ESTA LÍNEA PARA SOLUCIONAR EL ERROR

  @Output() onUpdate = new EventEmitter<string>();

  constructor(
    private ProductServiceService: ProductServiceService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService
  ) { }

  get filteredSubcategories(): Subcategory[] {
    const selectedCatId = this.productEdit.category_id;
    if (!selectedCatId) return [];
    return this.subcategories.filter(s => Number(s.category_id) === Number(selectedCatId));
  }

  onCategoryChange(): void {
    this.productEdit.subcategory_id = undefined;
  }

  update(): void {
    if (!this.productEdit.id_product) return;

    this.ProductServiceService.update(
      this.productEdit.id_product,
      this.productEdit
    ).subscribe({
      next: () => {
        this.uiMessage.show('Producto actualizado correctamente', 'success');
        this.toolservice.notifyUpdate();

        const modalEl = document.getElementById('modalEditProd');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();
      },
      error: err => {
        this.uiMessage.show(
          err?.error?.message || 'Error al actualizar el producto',
          'warning'
        );
      }
    });
  }
}