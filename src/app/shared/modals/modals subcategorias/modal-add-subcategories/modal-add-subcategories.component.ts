import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SubcategoryServiceService } from '../../../../services/subcategory-service.service';
import { ToolService } from '../../../../services/tool.service';
import { UiMessageService } from '../../../../services/ui-message.service';

@Component({
  selector: 'app-modal-add-subcategories',
  templateUrl: './modal-add-subcategories.component.html',
  styleUrl: './modal-add-subcategories.component.css',
  standalone: false
})
export class ModalAddSubcategoryComponent {

  @Input() categories: any[] = [];
  @Output() onSave = new EventEmitter<string>();

  sub: any = {
    name_subcategory: '',
    state_subcategory: 1,
    category_id: null
  };

  constructor(
    private subService: SubcategoryServiceService
    , private toolservice: ToolService
    , private uiMessage: UiMessageService

  ) { }

  save(): void {
    if (!this.sub.name_subcategory || !this.sub.category_id) return;

    const dataToSend = {
      name_subcategory: this.sub.name_subcategory,
      state_subcategory: Number(this.sub.state_subcategory),
      category_id: Number(this.sub.category_id)
    };

    this.subService.create(dataToSend).subscribe({
      next: () => {
        this.uiMessage.show('Subcategoría creada con éxito', 'success');
        this.toolservice.notifyUpdate();

        this.resetForm();
      },
      error: err => {
        this.uiMessage.show(
          err?.error?.message || 'Error al crear la subcategoría',
          'warning'
        );
        console.error('Error al guardar subcategoría', err);
      }
    });
  }
  resetForm() {
    this.sub = {
      name_subcategory: '',
      state_subcategory: 1,
      category_id: null
    };

  }
}
