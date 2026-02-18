import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PaymentMethod } from '../../../../models/paymentMethod.model';
import { SaleService } from '../../../../services/sale.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modalcheckout',
  standalone: false,
  templateUrl: './modalcheckout.component.html',
  styleUrl: './modalcheckout.component.css'
})
export class ModalcheckoutComponent {
  @Input() total: number = 0;
  @Input() cart: any[] = [];
  @Output() saleSuccess = new EventEmitter<void>();

  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethodId: number = 0;
  amount_paid: number = 0;
  change_returned: number = 0;

  constructor(private saleService: SaleService) { }

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods() {
    this.saleService.getPaymentMethods().subscribe(res => {
      this.paymentMethods = res;
      if (res.length > 0) this.selectedPaymentMethodId = res[0].id_payment_method;
    });
  }

  calculateChange() {
    this.change_returned = this.amount_paid - this.total;
  }

  confirmSale() {
    const saleData = {
      items: this.cart.map(item => ({
        product_id: item.id_product,
        quantity: item.quantity
      })),
      payments: [{
        payment_method_id: Number(this.selectedPaymentMethodId),
        amount: this.total,
        amount_paid: this.amount_paid,
        change_returned: this.change_returned > 0 ? this.change_returned : 0
      }]
    };

    this.saleService.createSale(saleData).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Venta Completada',
          text: `Cambio: $${this.change_returned > 0 ? this.change_returned : 0}. ¿Descargar factura?`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Sí, descargar',
          cancelButtonText: 'Nueva venta'
        }).then((result) => {
          if (result.isConfirmed) this.downloadInvoice(res.id_sale);
          this.resetInternal();
          this.saleSuccess.emit();  
        });
      },
      error: (err) => Swal.fire('Error', 'Error al procesar la venta', 'error')
    });
  }

  downloadInvoice(id: number) {
    this.saleService.downloadInvoice(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  resetInternal() {
    this.amount_paid = 0;
    this.change_returned = 0;
  }
}

