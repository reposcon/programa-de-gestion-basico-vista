import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { SaleService } from '../../../services/sale.service';
import { PaymentMethod } from '../../../models/paymentMethod.model';
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

  constructor(private productService: ProductServiceService) { }

  ngOnInit(): void { this.loadProducts(); }

  loadProducts() {
    this.productService.getAll().subscribe(res => {
      this.products = res;
      this.filteredProducts = res;
    });
  }

  addToCart(product: any) {
    const existing = this.cart.find(i => i.id_product === product.id_product);
    if (existing) {
      existing.quantity++;
      existing.subtotal = existing.quantity * existing.price_sell;
    } else {
      this.cart.push({ ...product, quantity: 1, subtotal: product.price_sell });
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cart.reduce((acc, item) => acc + item.subtotal, 0);
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
  onSaleSuccess() {
    this.cart = [];
    this.total = 0;
    this.searchQuery = '';
    this.loadProducts();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.calculateTotal();
  }

  clearCart() {
    if (this.cart.length === 0) return;

    Swal.fire({
      title: '¿Vaciar carrito?',
      text: "Se eliminarán todos los productos seleccionados",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cart = [];
        this.total = 0;
      }
    });
  }
}
