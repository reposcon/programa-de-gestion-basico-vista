import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryServiceService } from '../../../../services/category-service.service';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

@Component({
  selector: 'app-modal-edit-categories',
  templateUrl: './modal-edit-categories.component.html',
  standalone: false
})
export class ModalEditCategoriesComponent {

  @Input() categoryEdit: any = {};
  @Output() onUpdate = new EventEmitter<string>();

  constructor(
    private categoryService: CategoryServiceService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService
  ) {}

 update(): void {
  const id = this.categoryEdit.id_category;
  if (!id) return;

  this.categoryService.update(id, this.categoryEdit).subscribe({
    next: () => {
      this.uiMessage.show('Categoría actualizada correctamente', 'success');
      this.toolservice.notifyUpdate();
    },
    error: err => {
      this.uiMessage.show(
        err?.error?.message || 'Error al actualizar categoría',
        'warning'
      );
      console.error('Error al actualizar', err);
    }
  });
}


}
