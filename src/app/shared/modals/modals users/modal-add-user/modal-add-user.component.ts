import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../../../models/user.model';
import { userService } from '../../../../services/user.service';
import { UiMessageService } from '../../../../services/ui-message.service';

@Component({
  selector: 'app-modal-add-user',
  standalone: false,
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.css']
})
export class ModalAddUserComponent {

  @Output() save = new EventEmitter<void>(); 
  @Output() close = new EventEmitter<void>();

  constructor(
    private userService: userService, 
    private uiMessage: UiMessageService
  ) {}

  form: User = {
    name_user: '',
    password_user: '',
    rol: 'basico',
    state: 1
  };

  submit(): void {
    if (!this.form.name_user || !this.form.password_user) {
      this.uiMessage.show('Por favor, completa todos los campos', 'info');
      return;
    }

    this.userService.create(this.form).subscribe({
      next: () => {
        this.uiMessage.show('Usuario registrado con éxito', 'success');
        this.save.emit();
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.uiMessage.show('Error al registrar usuario', 'danger');
      }
    });
  }

  cancel(): void {
    this.close.emit();
  }
}