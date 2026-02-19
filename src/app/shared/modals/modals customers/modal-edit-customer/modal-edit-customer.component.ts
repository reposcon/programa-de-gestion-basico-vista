import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../../../../services/customer.service';
import { ToolService } from '../../../../services/tool.service'; 

@Component({
  selector: 'app-modal-edit-customer',
  standalone: false,
  templateUrl: './modal-edit-customer.component.html'
})
export class ModalEditCustomerComponent {
  @Input() customerEdit: any = {};
  @Output() onUpdate = new EventEmitter<string>();

  constructor(
    private customerService: CustomerService,
    private toolService: ToolService 
  ) {}

  update() {
    this.customerService.updateCustomer(this.customerEdit.id_customer, this.customerEdit).subscribe({
      next: () => {
        this.toolService.notifyUpdate(); 
        
        this.onUpdate.emit('Cliente actualizado con éxito');
        
        document.getElementById('closeEditCust')?.click();
      },
      error: (err) => console.error('Error al actualizar cliente', err)
    });
  }
}