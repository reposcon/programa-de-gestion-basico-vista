import { Component, OnInit } from '@angular/core';
import { userService } from '../../services/user.service';
import { UiMessageService } from '../../services/ui-message.service';
import { ToolService } from '../../services/tool.service';

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

  showModal: boolean = false;    
  showEditModal: boolean = false;  
  userToEdit: any = {};

  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  constructor(
    private userService: userService,
    private uiMessage: UiMessageService,
    private toolService: ToolService
  ) { }

  ngOnInit() {
    this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
    });
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: data => {
        this.users = data.sort((a: any, b: any) => b.state_user - a.state_user);
        
        if (this.userlogged?.id_role === 2) {
          this.users = [this.userlogged];
        }

        this.filteredUsers = [...this.users];
        this.currentPage = 1;
      },
      error: () => this.uiMessage.show('Error al obtener usuarios', 'warning')
    });
  }


  openAddModal(): void {
    this.showModal = true;
  }

  openEditModal(user: any): void {
    this.userToEdit = { ...user };
    this.showEditModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.showEditModal = false;
    this.userToEdit = {}; 
  }

  handleSuccess(): void {
    this.loadUsers();
    this.closeModal();
  }


  filterUsers(): void {
    const term = this.searchUser.toLowerCase();
    this.filteredUsers = this.users
      .filter(u => u.name_user.toLowerCase().includes(term))
      .sort((a, b) => b.state_user - a.state_user);
    this.currentPage = 1;
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
          },
          error: () => this.uiMessage.show('Error al desactivar usuario', 'warning')
        });
      }
    });
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