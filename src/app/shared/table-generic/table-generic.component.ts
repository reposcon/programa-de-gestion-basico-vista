import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table-generic',
  standalone: false,
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.css']
})
export class TableGenericComponent {
  @Input() title: string = '';
  @Input() breadcrumb: string = '';
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() canCreate: boolean = false;
  @Input() addButtonText: string = 'Añadir';
  @Input() addModalTarget: string = '';
  @Input() backLink?: string; 
  @Output() onAdd = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<string>();

  @Input() pageSize: number = 5;
  currentPage: number = 1;
  pageSizeOptions = [5, 10, 20];

  @Input() actionTemplate: TemplateRef<any> | null = null;

  get totalPages(): number {
    return Math.ceil(this.data.length / (this.pageSize || 1));
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}