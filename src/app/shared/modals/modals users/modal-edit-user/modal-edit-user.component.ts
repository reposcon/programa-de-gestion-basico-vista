import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { userService } from '../../../../services/user.service';
import { UiMessageService } from '../../../../services/ui-message.service';
import { RoleService } from '../../../../services/role.service';

@Component({
  selector: 'app-modal-edit-user',
  standalone: false,
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.css']
})
export class ModalEditUserComponent implements OnInit {

  @Input() user!: User;
  @Input() userlogged: any;
  @Output() update = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  form!: User;
  rolesList: any[] = [];

  constructor(
    private userService: userService,
    private uiMessage: UiMessageService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.form = { ...this.user };
    this.userService.getAll();
    this.roleService.roles$.subscribe(data => this.rolesList = data);
    this.roleService.loadRoles();
  }

  submit(): void {
    if (!this.form.name_user) {
      this.uiMessage.show('El nombre de usuario es obligatorio', 'warning');
      return;
    }

    const dataToSend = { ...this.form };

    if (!dataToSend.password_user || dataToSend.password_user.trim() === '') {
      delete dataToSend.password_user;
    }

    this.userService.update(this.form.id_user!, dataToSend).subscribe({
      next: () => {
        this.uiMessage.show('Usuario actualizado correctamente', 'success');
        this.update.emit();
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