import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { ReportService } from '../../../services/report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos',
  standalone: false,
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  cart: any[] = [];
  total: number = 0;
  searchQuery: string = '';
  isBoxOpen: boolean = false;

  constructor(
    private productService: ProductServiceService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.checkCashStatus();
    this.loadProducts();
  }

  trackByProduct(index: number, item: any): number {
    return item.id_product;
  }

  trackByCartItem(index: number, item: any): string {
    return `${item.id_product}-${index}`;
  }

  checkCashStatus() {
    this.reportService.checkStatus().subscribe({
      next: (res) => {
        this.isBoxOpen = res.is_open;
      },
      error: () => {
        this.isBoxOpen = false;
        console.error("No se pudo verificar el estado de la caja");
      }
    });
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => {
      this.products = res;
      this.filteredProducts = res;
    });
  }

  addToCart(product: any) {
    if (!this.isBoxOpen) {
      this.alertBoxClosed();
      return;
    }

    const existing = this.cart.find(i => i.id_product === product.id_product);
    if (existing) {
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.price_sell;
    } else {
      this.cart.push({
        ...product,
        quantity: 1,
        subtotal: Number(product.price_sell)
      });
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cart.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(p =>
      p.name_product.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  onSaleSuccess() {
    this.cart = [];
    this.total = 0;
    this.searchQuery = '';
    this.loadProducts();

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
  }

  alertBoxClosed() {
    Swal.fire({
      title: 'Caja Cerrada',
      text: 'Debes abrir una sesión de caja antes de realizar ventas.',
      icon: 'warning',
      confirmButtonColor: '#3498db',
      confirmButtonText: 'Entendido'
    });
  }

  clearCart() {
    if (this.cart.length === 0) return;
    Swal.fire({
      title: '¿Vaciar carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, vaciar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cart = [];
        this.total = 0;
      }
    });
  }
}