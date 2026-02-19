import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ProductServiceService } from '../../../services/product-service.service';
import { CategoryServiceService } from '../../../services/category-service.service';
import { SubcategoryServiceService } from '../../../services/subcategory-service.service';
import { SaleService } from '../../../services/sale.service'; // <--- Importante para los impuestos
import { userService } from '../../../services/user.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { Subcategory } from '../../../models/subcategory.model';
import { ToolService } from '../../../services/tool.service';
import { UiMessageService } from '../../../services/ui-message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css'],
})

export class ProductPageComponent implements OnInit, OnDestroy {
  products: any[] = [];
  productsFilter: any[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  taxes: any[] = []; 
  productEdit: Partial<Product> = {};
  columns: any[] = [];
  userlogged: any = null;
  private userSub!: Subscription;
  private updateSub!: Subscription;

  constructor(
    private productService: ProductServiceService,
    private categoryService: CategoryServiceService,
    private subcategoryService: SubcategoryServiceService,
    private saleService: SaleService, 
    private userService: userService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.columns = this.toolservice.getColumns('products');
    
    this.userSub = this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
      if (this.userlogged && this.authService.hasPermission('view_products')) {
        this.loadInitialData();
      }
    });

    this.updateSub = this.toolservice.update$.subscribe(() => {
      if (this.authService.hasPermission('view_products')) this.loadInitialData();
    });
  }

  loadInitialData(): void {
    forkJoin({
      categories: this.categoryService.getAll(),
      subcategories: this.subcategoryService.getAll(),
      products: this.productService.getAll(),
      taxes: this.saleService.getTaxSettings() 
    }).subscribe({
      next: ({ categories, subcategories, products, taxes }) => {
        this.categories = categories;
        this.subcategories = subcategories;
        this.taxes = taxes;

        this.products = products.map((p: any) => {
          const cat = this.categories.find(c => c.id_category === p.category_id);
          const sub = this.subcategories.find(s => s.id_subcategory === p.subcategory_id);

          return {
            ...p,
            name_category: cat?.name_category ?? 'Sin categoría',
            name_subcategory: sub?.name_subcategory ?? 'Sin subcategoría',
            stock_product: p.stock ?? 0,
            price_product: p.price_sell ?? 0,
            isActive: p.state_product === 1
          };
        });
        this.applyFiltersAndOrder('');
      },
      error: () => this.uiMessage.show('Error al cargar datos iniciales', 'warning')
    });
  }

  applyFiltersAndOrder(term: string): void {
    const search = term.toLowerCase();
    this.productsFilter = this.products
      .filter(p => p.name_product?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }

  // --- LÓGICA DE EXCEL ---

  downloadTemplate(): void {
    this.productService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formato_productos.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.uiMessage.show('No se pudo descargar la plantilla', 'warning')
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.toolservice.confirm({
      title: '¿Importar productos?',
      text: `Se cargarán los datos desde el archivo: ${file.name}`,
      icon: 'info',
      confirmText: 'Sí, importar'
    }).then(confirmed => {
      if (confirmed) {
        this.productService.importExcel(file).subscribe({
          next: (res) => {
            this.uiMessage.show(res.message || 'Importación exitosa', 'success');
            this.toolservice.notifyUpdate(); // Recarga la tabla
          },
          error: (err) => {
            const errorMsg = err.error?.message || 'Error al procesar el archivo Excel';
            this.uiMessage.show(errorMsg, 'warning');
          }
        });
      }
      event.target.value = ''; 
    });
  }


  toggleProduct(prod: any): void {
    const isActive = prod.state_product === 1;
    this.toolservice.confirm({
      title: isActive ? '¿Desactivar producto?' : '¿Restaurar producto?',
      text: `El producto "${prod.name_product}" cambiará su estado.`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;
      this.productService.toggle(prod.id_product).subscribe({
        next: () => {
          this.uiMessage.show(isActive ? 'Producto desactivado' : 'Producto restaurado', 'success');
          this.toolservice.notifyUpdate();
        }
      });
    });
  }

  openEditModal(prod: any): void {
    this.productEdit = { ...prod };
  }

  prepareAdd(): void {
    this.productEdit = {}; 
  }

  reloadProducts(msg: string): void {
    this.loadInitialData();
    if (msg) this.uiMessage.show(msg, 'success');
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.updateSub?.unsubscribe();
  }
}