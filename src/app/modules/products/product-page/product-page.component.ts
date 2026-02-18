import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ProductServiceService } from '../../../services/product-service.service';
import { CategoryServiceService } from '../../../services/category-service.service';
import { SubcategoryServiceService } from '../../../services/subcategory-service.service';
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
  productEdit: Partial<Product> = {};
  columns: any[] = [];
  userlogged: any = null;
  private userSub!: Subscription;

  constructor(
    private productService: ProductServiceService,
    private categoryService: CategoryServiceService,
    private subcategoryService: SubcategoryServiceService,
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

    this.toolservice.update$.subscribe(() => {
      if (this.authService.hasPermission('view_products')) this.loadInitialData();
    });
  }

  loadInitialData(): void {
    forkJoin({
      categories: this.categoryService.getAll(),
      subcategories: this.subcategoryService.getAll(),
      products: this.productService.getAll()
    }).subscribe({
      next: ({ categories, subcategories, products }) => {
        this.categories = categories;
        this.subcategories = subcategories;

        this.products = products.map((p: any) => {
          const cat = this.categories.find(c => c.id_category === p.category_id);
          const sub = this.subcategories.find(s => s.id_subcategory === p.subcategory_id);

          return {
            ...p,
            name_category: cat?.name_category ?? 'Sin categoría',
            name_subcategory: sub?.name_subcategory ?? 'Sin subcategoría',

            stock_product: p.stock_product ?? p.stock ?? 0,
            price_product: p.price_sell ?? p.price_sell ?? 0,

            isActive: p.state_product === 1
          };
        });
        this.applyFiltersAndOrder('');
      }
    });
  }

  applyFiltersAndOrder(term: string): void {
    const search = term.toLowerCase();
    this.productsFilter = this.products
      .filter(p => p.name_product?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
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

  openEditModal(prod: Product): void {
    this.productEdit = { ...prod };
  }

  reloadProducts(msg: string): void {
    this.loadInitialData();
    this.uiMessage.show(msg, 'success');
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
