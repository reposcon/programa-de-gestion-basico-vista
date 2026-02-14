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

  products: (Product & { name_category: string; name_subcategory: string; categoryActive: boolean; subcategoryActive: boolean; isActive: boolean })[] = [];
  productsFilter: typeof this.products = [];

  categories: Category[] = [];
  subcategories: Subcategory[] = [];

  productEdit: Partial<Product> = {};

  searchProducts = '';
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  showMessage = false;
  message = '';

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
    this.userSub = this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
      if (this.userlogged && this.authService.hasPermission('view_products')) {
        this.loadInitialData();
      }
    });

    this.toolservice.update$.subscribe(() => {
      if (this.authService.hasPermission('view_products')) {
        this.loadInitialData();
      }
    });
  }


  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
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

        this.products = products.map((p: Product) => {
          const cat = this.categories.find(c => c.id_category === p.category_id);
          const sub = this.subcategories.find(s => s.id_subcategory === p.subcategory_id);

          return {
            ...p,
            name_category: cat?.name_category ?? 'Sin categoría',
            name_subcategory: sub?.name_subcategory ?? 'Sin subcategoría',
            categoryActive: cat?.state_category === 1,
            subcategoryActive: sub?.state_subcategory === 1,
            isActive: p.state_product === 1
          };
        });

        this.applyFiltersAndOrder();
      },
      error: err => console.error(err)
    });
  }

  toggleProduct(
    prod: Product & {
      categoryActive: boolean;
      subcategoryActive: boolean;
      isActive: boolean;
    }
  ): void {

    const isActive = prod.state_product === 1;

    this.toolservice.confirm({
      title: isActive ? '¿Desactivar producto?' : '¿Restaurar producto?',
      text: isActive
        ? `El producto "${prod.name_product}" quedará inactivo`
        : `El producto "${prod.name_product}" será restaurado`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;

      this.productService.toggle(prod.id_product).subscribe({
        next: () => {
          prod.isActive = !isActive;
          prod.state_product = prod.isActive ? 1 : 0;

          this.applyFiltersAndOrder();

          this.uiMessage.show(
            isActive
              ? 'Producto desactivado correctamente'
              : 'Producto restaurado correctamente',
            'success'
          );

          this.toolservice.notifyUpdate();
        },
        error: (err) => {
          this.uiMessage.show(
            err?.error?.message || 'Error al actualizar el producto',
            'warning'
          );
        }
      });
    });
  }



  applyFiltersAndOrder(): void {
    const search = this.searchProducts.toLowerCase();
    this.productsFilter = this.products
      .filter(p => p.name_product?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
    this.currentPage = 1;
  }


  openEditModal(prod: Product): void {
    this.productEdit = { ...prod };
  }

  reloadProducts(msg: string): void {
    this.loadInitialData();
    this.showSuccessMessage(msg);
  }

  showSuccessMessage(msg: string): void {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 3000);
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.productsFilter.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.productsFilter.length / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}
