import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductServiceService } from '../../../../services/product-service.service';
import { Category } from '../../../../models/category.model';
import { Subcategory } from '../../../../models/subcategory.model';
import { Product } from '../../../../models/product.model';

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

  @Output() onUpdate = new EventEmitter<string>();

  constructor(private ProductServiceService: ProductServiceService) { }

  update() {
    if (!this.productEdit.id_product) return;

    this.ProductServiceService.update(
      this.productEdit.id_product,
      this.productEdit
    ).subscribe({
      next: () => {
        this.onUpdate.emit('Producto actualizado correctamente');

        const modalEl = document.getElementById('modalEditProd');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();
      }
    });
  }


}
