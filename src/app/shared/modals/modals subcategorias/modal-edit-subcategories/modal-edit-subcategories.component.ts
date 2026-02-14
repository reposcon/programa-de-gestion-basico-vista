import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubcategoryServiceService } from '../../../../services/subcategory-service.service';
import { Category } from '../../../../models/category.model';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

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

  constructor(private subcategoryService: SubcategoryServiceService
    , private toolservice: ToolService
    , private uiMessage: UiMessageService
  ) { }

  update(): void {
    if (!this.subEdit.id_subcategory) return;

    this.subcategoryService
      .update(this.subEdit.id_subcategory, this.subEdit)
      .subscribe({
        next: () => {
          this.uiMessage.show(
            'Subcategoría actualizada correctamente',
            'success'
          );

          this.toolservice.notifyUpdate();
        },
        error: err => {
          this.uiMessage.show(
            err?.error?.message || 'Error al actualizar la subcategoría',
            'warning'
          );
          console.error('Error al actualizar subcategoría:', err);
        }
      });
  }


}