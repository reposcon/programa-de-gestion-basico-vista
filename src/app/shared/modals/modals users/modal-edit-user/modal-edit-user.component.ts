import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { userService } from '../../../../services/user.service';
import { UiMessageService } from '../../../../services/ui-message.service';

@Component({
  selector: 'app-modal-edit-user',
  standalone: false,
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.css']
})
export class ModalEditUserComponent implements OnInit {

  @Input() user!: User;

  @Output() update = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  form!: User;

  constructor(
    private userService: userService, 
    private uiMessage: UiMessageService
  ) {}

  ngOnInit(): void {
    this.form = { ...this.user };
  }

  submit(): void {
    if (!this.form.name_user) {
      this.uiMessage.show('El nombre de usuario es obligatorio', 'warning');
      return;
    }

    this.userService.update(this.form.id_user!, this.form).subscribe({
      next: () => {
        this.uiMessage.show('Usuario actualizado correctamente', 'success');
        this.update.emit(); // Notifica al padre para cerrar y recargar
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.uiMessage.show('No se pudieron guardar los cambios', 'danger');
      }
    });
  }

  cancel(): void {
    this.close.emit();
  }
}