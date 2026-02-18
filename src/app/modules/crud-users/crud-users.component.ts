import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import { UiMessageService } from '../../services/ui-message.service';
import { ToolService } from '../../services/tool.service';
import { AuthService } from '../../services/auth.service';

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
  columns: any[] = [];

  showModal: boolean = false;
  showEditModal: boolean = false;
  userToEdit: any = {};

  constructor(
    private userService: userService,
    private uiMessage: UiMessageService,
    private toolService: ToolService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.columns = this.toolService.getColumns('users');
    this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
      if (this.userlogged && (this.userlogged.id_role === 1 || this.authService.hasPermission('view_users'))) {
        this.loadUsers();
      }
    });
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: data => {
        // Mapeo para aplanar el objeto role y que la tabla lo reconozca
        let processedUsers = data.map((u: any) => ({
          ...u,
          name_role: u.role?.name_role || 'Sin Rol'
        })).sort((a: any, b: any) => b.state_user - a.state_user);

        if (this.userlogged?.id_role === 2) {
          processedUsers = processedUsers.filter((u: any) => u.id_user === this.userlogged.id_user);
        }

        this.users = processedUsers;
        this.filteredUsers = [...this.users];
      },
      error: () => this.uiMessage.show('Error al obtener usuarios', 'warning')
    });
  }

  filterUsers(term: string): void {
    const search = term.toLowerCase();
    this.filteredUsers = this.users
      .filter(u => u.name_user.toLowerCase().includes(search))
      .sort((a, b) => b.state_user - a.state_user);
  }

  deleteUser(user: any) {
    if (user.state_user === 0) return;
    this.toolService.confirm({
      title: '¿Desactivar usuario?',
      text: `Estás a punto de desactivar a ${user.name_user}.`,
      confirmText: 'Sí, desactivar'
    }).then(confirmed => {
      if (confirmed) {
        this.userService.delete(user.id_user).subscribe({
          next: () => {
            this.loadUsers();
            this.uiMessage.show('Usuario desactivado correctamente', 'success');
          }
        });
      }
    });
  }

  // Métodos de control de modales
  openAddModal(): void { this.showModal = true; }
  openEditModal(user: any): void { this.userToEdit = { ...user }; this.showEditModal = true; }
  closeModal(): void { this.showModal = false; this.showEditModal = false; this.userToEdit = {}; }
  handleSuccess(): void { this.loadUsers(); this.closeModal(); }
}