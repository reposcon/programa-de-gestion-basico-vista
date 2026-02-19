import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaymentMethod } from '../../../../models/paymentMethod.model';
import { SaleService } from '../../../../services/sale.service';
import { CustomerService } from '../../../../services/customer.service';
import { ToolService } from '../../../../services/tool.service';
import { Customer } from '../../../../models/customer.model';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-modalcheckout',
  standalone: false,
  templateUrl: './modalcheckout.component.html',
  styleUrl: './modalcheckout.component.css'
})
export class ModalcheckoutComponent implements OnInit {
  @Input() total: number = 0;
  @Input() cart: any[] = [];
  @Output() saleSuccess = new EventEmitter<void>();

  paymentMethods: PaymentMethod[] = [];
  payments: any[] = [];
  change_returned: number = 0;

  documentSearch: string = '';
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  selectedCustomer: Customer | null = null;

  newCustomer: Customer = {
    name_customer: '',
    document_number_customer: '',
    email_customer: '',
    phone_customer: ''
  };

  readonly MONTO_MAXIMO_ANONIMO = 212000;

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private toolService: ToolService // <--- Inyectamos el servicio
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadPaymentMethods();
    this.resetInternal();
  }

  toggleCustomerForm() {
    const element = document.getElementById('formQuickClient');
    if (element) {
      const bsCollapse = bootstrap.Collapse.getInstance(element) || new bootstrap.Collapse(element);
      element.classList.contains('show') ? bsCollapse.hide() : bsCollapse.show();
    }
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(res => this.customers = res);
  }

  loadPaymentMethods() {
    this.saleService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
      if (this.payments.length === 0) this.addPaymentRow();
    });
  }

  filterCustomers() {
    const query = this.documentSearch.toLowerCase();
    this.filteredCustomers = query ? this.customers.filter(c =>
      c.document_number_customer.includes(query) ||
      c.name_customer.toLowerCase().includes(query)
    ) : [];
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.documentSearch = customer.document_number_customer;
    this.filteredCustomers = [];
  }

  clearCustomer() {
    this.selectedCustomer = null;
    this.documentSearch = '';
  }

  quickCreateCustomer() {
    if (!this.newCustomer.name_customer || !this.newCustomer.document_number_customer) {
      Swal.fire('Atención', 'Nombre y Documento son obligatorios', 'warning');
      return;
    }

    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: (res: any) => {
        Swal.fire({ icon: 'success', title: 'Cliente registrado', showConfirmButton: false, timer: 1500 });
        this.selectedCustomer = res.customer;
        this.loadCustomers();
        this.toggleCustomerForm();
        this.newCustomer = { name_customer: '', document_number_customer: '', email_customer: '', phone_customer: '' };
      },
      error: () => Swal.fire('Error', 'No se pudo crear el cliente', 'error')
    });
  }

  addPaymentRow() {
    this.payments.push({
      payment_method_id: this.paymentMethods.length > 0 ? this.paymentMethods[0].id_payment_method : 0,
      amount: 0
    });
  }

  removePaymentRow(index: number) {
    if (this.payments.length > 1) this.payments.splice(index, 1);
    this.calculateChange();
  }

  get totalPaid(): number {
    return this.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  }

  calculateChange() {
    this.change_returned = this.totalPaid - this.total;
  }

  confirmSale() {
    if (this.total >= this.MONTO_MAXIMO_ANONIMO && !this.selectedCustomer) {
      Swal.fire('Identificación Requerida', `Ventas superiores a ${this.MONTO_MAXIMO_ANONIMO} requieren cliente.`, 'warning');
      return;
    }

    if (this.totalPaid < this.total) {
      Swal.fire('Pago Incompleto', `Faltan ${(this.total - this.totalPaid)}`, 'error');
      return;
    }

    const saleData = {
      customer_id: this.selectedCustomer?.id_customer || null,
      items: this.cart.map(item => ({ product_id: item.id_product, quantity: item.quantity })),
      payments: this.payments.map(p => ({
        payment_method_id: Number(p.payment_method_id),
        amount: p.amount,
        change_returned: this.change_returned > 0 ? this.change_returned : 0
      }))
    };

    this.toolService.confirm({
      title: '¿Confirmar Venta?',
      text: `Se registrará la venta por un total de $${this.total}.`,
      icon: 'question',
      confirmText: 'Sí, cobrar ahora',
      cancelText: 'Revisar de nuevo'
    }).then((confirmed) => {
      if (confirmed) {
        this.executeSaleCreation(saleData);
      }
    });
  }
  private executeSaleCreation(saleData: any) {
    this.saleService.createSale(saleData).subscribe({
      next: (res) => {

        // ===== CERRAR MODAL BOOTSTRAP CORRECTAMENTE =====
        const modalElement = document.getElementById('modalPago');
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);

          modalInstance.hide();
        }

        // ===== LIMPIEZA DEFINITIVA DEL BODY =====
        setTimeout(() => {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';

          // eliminar backdrops huérfanos
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(b => b.remove());

          // ===== AHORA SÍ MOSTRAR SWEETALERT =====
          Swal.fire({
            title: 'Venta Exitosa',
            text: `Cambio a devolver: $${this.change_returned > 0 ? this.change_returned : 0}`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Imprimir Factura',
            cancelButtonText: 'Cerrar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) this.downloadInvoice(res.id_sale);

            this.resetInternal();
            this.saleSuccess.emit();
            this.toolService.notifyUpdate();
          });

        }, 300); // ⬅ tiempo clave
      },

      error: () => Swal.fire('Error', 'No se pudo procesar la venta', 'error')
    });
  }
  downloadInvoice(id: number) {
    this.saleService.downloadInvoice(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  resetInternal() {
    this.payments = [];
    this.addPaymentRow();
    this.change_returned = 0;
    this.selectedCustomer = null;
    this.documentSearch = '';
  }
}