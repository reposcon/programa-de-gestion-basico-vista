import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryServiceService } from '../../../../services/category-service.service';

@Component({
  selector: 'app-modal-edit-categories',
  templateUrl: './modal-edit-categories.component.html',
  standalone: false
})
export class ModalEditCategoriesComponent {

  @Input() categoryEdit: any = {};
  @Output() onUpdate = new EventEmitter<string>();

  constructor(private categoryService: CategoryServiceService) {}

  update() {
    if (!this.categoryEdit.id_category) return;

    this.categoryService
      .update(this.categoryEdit.id_category, this.categoryEdit)
      .subscribe({
        next: () => this.onUpdate.emit('Categoría actualizada con éxito'),
        error: err => console.error('Error al actualizar', err)
      });
  }

}
