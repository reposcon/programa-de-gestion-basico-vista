// customer.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import { userService } from '../../../services/user.service';
import { ToolService } from '../../../services/tool.service';
import { UiMessageService } from '../../../services/ui-message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit, OnDestroy {
  customers: any[] = [];
  customersFilter: any[] = [];
  customerEdit: any = {};
  columns: any[] = [];
  userlogged: any = null;

  private userSub!: Subscription;
  private updateSub!: Subscription; // <--- Nueva suscripción para limpieza

  constructor(
    private customerService: CustomerService,
    private userService: userService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.columns = this.toolservice.getColumns('customers');

    this.userSub = this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
      if (this.userlogged && this.authService.hasPermission('view_customers')) {
        this.loadInitialData();
      }
    });

    this.updateSub = this.toolservice.update$.subscribe(() => {
      if (this.authService.hasPermission('view_customers')) {
        this.loadInitialData();
      }
    });
  }

  loadInitialData(): void {
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers.map((c: any) => ({
          ...c,
          isActive: c.state_customer === 1 
        }));
        this.applyFilters('');
      }
    });
  }

  applyFilters(term: string): void {
    const search = term.toLowerCase();
    this.customersFilter = this.customers
      .filter(c =>
        c.name_customer?.toLowerCase().includes(search) ||
        c.document_number_customer?.includes(search)
      )
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }

  toggleCustomer(cust: any): void {
    const isActive = cust.state_customer === 1;
    this.toolservice.confirm({
      title: isActive ? '¿Desactivar cliente?' : '¿Restaurar cliente?',
      text: `El cliente "${cust.name_customer}" cambiará su estado.`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;

      this.customerService.toggle(cust.id_customer).subscribe({
        next: (res: any) => {
          this.uiMessage.show(res.message, 'success');
          this.toolservice.notifyUpdate();
        }
      });
    });
  }

  openEditModal(cust: any): void {
    this.customerEdit = { ...cust };
  }

  handleResponse(msg: string): void {
    this.uiMessage.show(msg, 'success');
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.updateSub?.unsubscribe();
  }
}