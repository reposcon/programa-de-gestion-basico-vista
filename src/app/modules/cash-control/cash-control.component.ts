import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { UiMessageService } from '../../services/ui-message.service';
import { ToolService } from '../../services/tool.service'; // Importamos el servicio de herramientas

@Component({
  selector: 'app-cash-control',
  standalone: false,
  templateUrl: './cash-control.component.html'
})
export class CashControlComponent implements OnInit {
  title = 'Gestión de Caja';
  breadcrumb = 'Control de Caja';
  columns: any[] = [];
  historyRaw: any[] = [];

  isCashOpen = false;
  openingAmount = 0;
  currentSession: any = null;
  summary: any = null;

  history: any[] = [];

  constructor(
    private reportService: ReportService,
    private uiMessage: UiMessageService,
    private toolService: ToolService
  ) { }

  ngOnInit(): void {
    this.columns = this.toolService.getColumns('cash_sessions');

    this.checkStatus();
    this.loadHistory();
  }

  checkStatus(): void {
    this.reportService.checkStatus().subscribe({
      next: (res) => {
        this.isCashOpen = res.is_open;
        this.currentSession = res.session;
      },
      error: () => this.uiMessage.show('Error al verificar estado de caja', 'danger')
    });
  }

  loadHistory(): void {
    this.reportService.getHistory().subscribe({
      next: (res) => {
        this.history = res.history;
        this.historyRaw = res.history;
      },
      error: () => this.uiMessage.show('Error al cargar historial', 'danger')
    });
  }

  handleOpenSession(): void {
    if (this.openingAmount === null || this.openingAmount < 0) {
      this.uiMessage.show('Ingrese un monto inicial válido', 'warning');
      return;
    }

    this.reportService.openSession(this.openingAmount).subscribe({
      next: (res) => {
        this.uiMessage.show(res.message, 'success');
        this.openingAmount = 0;
        this.checkStatus();
        this.summary = null;
        this.loadHistory();
      },
      error: (e) => this.uiMessage.show(e.error.message || 'Error al abrir caja', 'danger')
    });
  }

  async handleCloseSession(): Promise<void> {
    const confirmed = await this.toolService.confirm({
      title: '¿Cerrar Turno?',
      text: 'Se calcularán las ventas totales hasta este momento.',
      confirmText: 'Sí, cerrar caja',
      icon: 'question'
    });

    if (!confirmed) return;

    this.reportService.closeSession().subscribe({
      next: (res) => {
        this.uiMessage.show('Caja cerrada correctamente', 'success');
        this.summary = res.summary;
        this.isCashOpen = false;
        this.currentSession = null;
        this.loadHistory();
      },
      error: (e) => this.uiMessage.show(e.error.message || 'Error al cerrar caja', 'danger')
    });
  }

  filterByDate(date: string) {
    if (!date) {
      this.history = [...this.historyRaw]; 
      return;
    }

    this.history = this.historyRaw.filter(item => item.opened_at.includes(date));
  }
}