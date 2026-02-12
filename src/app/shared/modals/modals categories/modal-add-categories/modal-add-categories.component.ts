import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryServiceService } from '../../../../services/category-service.service';
import { Category } from '../../../../models/category.model';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

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

  constructor(
    private categoryService: CategoryServiceService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService
  ) {}

save(): void {
  if (!this.categoryEdit.id_category) {
    // CREATE
    this.categoryService.create(this.categoryEdit).subscribe({
      next: () => {
        this.uiMessage.show('Categoría creada correctamente', 'success');
        this.toolservice.notifyUpdate();
      },
      error: err =>
        this.uiMessage.show(err?.error?.message || 'Error al crear categoría', 'warning')
    });
    return;
  }

  // UPDATE
  const id = this.categoryEdit.id_category; // aquí YA es number

  this.categoryService.update(id, this.categoryEdit).subscribe({
    next: () => {
      this.uiMessage.show('Categoría actualizada correctamente', 'success');
      this.toolservice.notifyUpdate();
    },
    error: err =>
      this.uiMessage.show(err?.error?.message || 'Error al actualizar categoría', 'warning')
  });
}


  private success(message: string) {
    this.onSave.emit(message);
  }
}
