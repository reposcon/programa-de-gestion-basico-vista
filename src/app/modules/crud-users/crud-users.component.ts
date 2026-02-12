import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
@Component({
  selector: 'app-crud-users',
  standalone: false, 
  templateUrl: './crud-users.component.html',
  styleUrls: ['./crud-users.component.css']
})
export class CrudUsersComponent implements OnInit {
  userlogged: any = null;
  users: any[] = [];
  filteredUsers: any[] = [];
  searchUser: string = '';
  role: string = '';

  showModal: boolean = false;
  isEditing: boolean = false;
  userToEdit: any = {};

  showMessage: boolean = false;
  message: string = '';

  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(private userService: userService) {}

  ngOnInit() {
    this.userService.userObservable$.subscribe(user => this.userlogged = user);
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: data => {
        this.users = data.sort((a:any, b:any) => b.state - a.state);
        this.role = this.userlogged?.rol;
        if (this.role === 'basico') this.users = [this.userlogged];
        this.filteredUsers = [...this.users];
        this.currentPage = 1;
      },
      error: err => console.error('Error al obtener usuarios:', err)
    });
  }

  filterUsers(): void {
    const term = this.searchUser.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name_user.toLowerCase().includes(term)
    ).sort((a, b) => b.state - a.state);
    this.currentPage = 1;
  }

  openAddModal(): void {
    this.isEditing = false;
    this.userToEdit = { name_user: '', rol: 'basico', state: 1 };
    this.showModal = true;
  }

  openEditModal(user: any): void {
    this.isEditing = true;
    this.userToEdit = { ...user };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveUser(userData: any) {
    if (this.isEditing) {
      this.userService.update(userData.id_user, userData).subscribe({
        next: () => {
          this.loadUsers(); 
          this.closeModal();
          this.showAlert('¡Usuario actualizado correctamente!');
        },
        error: () => this.showAlert('Error al actualizar usuario')
      });
    } else {
      userData.state = 1; 
      this.userService.create(userData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          this.showAlert('¡Usuario creado correctamente!');
        },
        error: () => this.showAlert('Error al crear usuario')
      });
    }
  }

  deleteUser(user: any) {
    if (user.state === 0) return;
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.userService.delete(user.id_user).subscribe({
      next: () => {
        this.loadUsers();
        this.showAlert('¡Usuario eliminado correctamente!');
      },
      error: () => this.showAlert('Error al eliminar usuario')
    });
  }

  showAlert(msg: string) {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}
