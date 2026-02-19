import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { ToolService } from '../../services/tool.service';
import { UiMessageService } from '../../services/ui-message.service';

@Component({
  selector: 'app-daily-sales',
  standalone:false,
  templateUrl: './daily-sales.component.html'
})
export class DailySalesComponent implements OnInit {
  title = 'Gestión de Ventas';
  breadcrumb = 'Facturación';
  
  sales: any[] = [];
  salesRaw: any[] = [];
  columns: any[] = [];

  constructor(
    private saleService: SaleService,
    private toolService: ToolService,
    private uiMessage: UiMessageService
  ) {
    this.columns = this.toolService.getColumns('sales');
  }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.sales = res.data.map((s: any) => ({
            ...s,
            customer_name: s.customer ? s.customer.name_customer : 'Consumidor Final',
            created_at: new Date(s.created_at).toLocaleString('es-CO')
          }));
          this.salesRaw = [...this.sales];
        }
      },
      error: () => this.uiMessage.show('Error al cargar las ventas', 'danger')
    });
  }

  filterBySearch(term: string): void {
    if (!term) {
      this.sales = [...this.salesRaw];
      return;
    }
    const t = term.toLowerCase();
    this.sales = this.salesRaw.filter(s => 
      s.invoice_number.toLowerCase().includes(t) || 
      s.customer_name.toLowerCase().includes(t)
    );
  }

  downloadInvoice(id: number): void {
    this.saleService.downloadInvoice(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Factura_${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.uiMessage.show('Error al generar el PDF', 'danger')
    });
  }

  filterByDate(date: string) {
    if (!date) {
      this.sales = [...this.salesRaw]; 
      return;
    }
    this.sales = this.salesRaw.filter(sale => 
      sale.created_at.includes(date)
    );
  }
}