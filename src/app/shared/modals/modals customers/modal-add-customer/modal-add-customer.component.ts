// modal-add-customer.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../../../services/customer.service';
import { ToolService } from '../../../../services/tool.service';
import { Customer
  
 } from '../../../../models/customer.model';
@Component({
  selector: 'app-modal-add-customer',
  standalone: false,
  templateUrl: './modal-add-customer.component.html'
})
export class ModalAddCustomerComponent {
  @Output() onSave = new EventEmitter<string>();

  customer: Customer = {
    name_customer: '',
    document_number_customer: '',
    email_customer: '',
    phone_customer: '',
    state_customer: 1
  };

  constructor(
    private customerService: CustomerService,
    private toolService: ToolService // <--- Inyectamos
  ) {}

  save() {
    this.customerService.createCustomer(this.customer).subscribe({
      next: () => {
        this.toolService.notifyUpdate(); 
        
        this.onSave.emit('Cliente creado con éxito');
        
        this.resetForm();
        document.getElementById('closeAddCust')?.click();
      },
      error: (err) => console.error('Error al crear cliente', err)
    });
  }

  resetForm() {
    this.customer = { name_customer: '', document_number_customer: '', email_customer: '', phone_customer: '', state_customer: 1 };
  }
}