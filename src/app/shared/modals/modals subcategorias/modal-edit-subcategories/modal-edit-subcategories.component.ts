import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubcategoryServiceService } from '../../../../services/subcategory-service.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-modal-edit-subcategories',
  templateUrl: './modal-edit-subcategories.component.html',
  styleUrl: './modal-edit-subcategories.component.css',
  standalone: false
})
export class ModalEditSubcategoriesComponent {

  @Input() categories: Category[] = [];
  @Input() subEdit: any = {};

  @Output() onUpdate = new EventEmitter<string>();

  constructor(private subcategoryService: SubcategoryServiceService) {}

  update() {
    if (!this.subEdit.id_subcategory) return;

    this.subcategoryService
      .update(this.subEdit.id_subcategory, this.subEdit)
      .subscribe({
        next: () => {
          this.onUpdate.emit('Subcategoría actualizada correctamente');
        },
        error: err => {
          console.error('Error al actualizar subcategoría:', err);
        }
      });
  }

}
