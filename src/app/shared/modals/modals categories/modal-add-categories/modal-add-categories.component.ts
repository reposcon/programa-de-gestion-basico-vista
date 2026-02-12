import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryServiceService } from '../../../../services/category-service.service';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-modal-add-categories',
  templateUrl: './modal-add-categories.component.html',
  styleUrl: './modal-add-categories.component.css',
  standalone: false
})
export class ModalAddCategoriesComponent {

  @Input() categoryEdit: Partial<Category> = {
    name_category: '',
    state_category: 1
  };

  @Output() onSave = new EventEmitter<string>();

  constructor(private categoryService: CategoryServiceService) {}

  save() {
    if (this.categoryEdit.id_category) {
      this.categoryService
        .update(this.categoryEdit.id_category, this.categoryEdit)
        .subscribe({
          next: () => this.success('Categoría actualizada correctamente'),
          error: err => console.error(err)
        });
    } else {
      this.categoryService
        .create(this.categoryEdit)
        .subscribe({
          next: () => this.success('Categoría creada correctamente'),
          error: err => console.error(err)
        });
    }
  }

  private success(message: string) {
    this.onSave.emit(message);
  }
}
