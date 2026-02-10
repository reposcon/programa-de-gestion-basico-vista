import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-crud-user',
  standalone: false,
  templateUrl: './crud-user.component.html',
  styleUrls: ['./crud-user.component.css']
})
export class CrudUserComponent implements OnInit {
  userlogged: any = null;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchUser: string = '';
  role: string = '';
  isEditing: boolean = false;
  userToEdit: any;

  showMessage: boolean = false;
  message: string = '';

  constructor(private userService: userService) { }

  ngOnInit() {

    this.userService.userObservable$.subscribe((user: any) => {
      this.userlogged = user;
    });
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.role = this.userlogged?.rol;
        if (this.role === 'basico') {
          this.users = [this.userlogged];
        }
        this.filteredUsers = this.users;
      },
      error: err => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  filterUsers(): void {
    const term = this.searchUser.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name_user.toLowerCase().includes(term)
    );
  }

  openModalAddUser(): void {
    this.isEditing = false;
    this.userToEdit = {
      name_user: '',
      rol: 'basico',
      state: 1
    };
    const modalEl = document.getElementById('modalEditarUsuario');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    }
  }

  openModalEditUser(user: any): void {
    this.isEditing = true;
    this.userToEdit = { ...user };
    new bootstrap.Modal(document.getElementById('modalEditarUsuario')).show();
  }

  saveUser(): void {
    if (!this.userToEdit.name_user || !this.userToEdit.rol) {
      this.showMessageAlert('Por favor completa los campos nombre de usuario y rol');
      return;
    }

    if (this.isEditing) {
      this.userService.update(this.userToEdit.id_user, this.userToEdit).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.showMessageAlert('¡Usuario actualizado correctamente!');
        },
        error: () => this.showMessageAlert('Error al actualizar usuario')
      });
    } else {
      this.userService.create(this.userToEdit).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.showMessageAlert('¡Usuario creado correctamente!');
        },
        error: () => this.showMessageAlert('Error al crear usuario')
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.loadUsers();
          this.showMessageAlert('¡Usuario eliminado correctamente!');
        },
        error: () => this.showMessageAlert('Error al eliminar usuario')
      });
    }
  }

  showMessageAlert(msg: string): void {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  closeModal(): void {
    const modalEl = document.getElementById('modalEditarUsuario');
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
  }
}
