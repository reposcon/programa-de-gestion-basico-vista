import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-modal-edit-add-user',
  standalone: false,
  templateUrl: './modal-edit-add-user.component.html',
  styleUrls: ['./modal-edit-add-user.component.css']
})
export class ModalEditAddUserComponent {

  @Input() isEditing: boolean = false;
  @Input() userData: User = { id_user: 0, name_user: '', password_user: '', rol: 'basico', state: 1 };
  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  onSubmit(): void {
    if (!this.userData.name_user || !this.userData.rol) return;
    this.save.emit(this.userData);
  }

  onClose(): void {
    this.close.emit();
  }
}
