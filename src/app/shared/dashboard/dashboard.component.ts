import { Component, OnInit } from '@angular/core';
import { CategoryServiceService } from '../../services/category-service.service';
import { SubcategoryServiceService } from '../../services/subcategory-service.service';
import { ProductServiceService } from '../../services/product-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { userService } from '../../services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false,
})
export class DashboardComponent implements OnInit {
  // ======= CATEGORÍAS =======
  category: any[] = [];
  categoryFilter: any[] = [];
  activeCategories: any[] = [];
  categoryEdit: any = {};
  
  // ======= SUBCATEGORÍAS =======
  subcategory: any[] = [];
  subcategoryFilter: any[] = [];
  activeSubcategories: any[] = [];
  subcategoryActiveFiltered: any[] = [];
  subcategoryEdit: any = {};
  
  // ======= PRODUCTOS =======
  products: any[] = [];
  productsFilter: any[] = [];
  productEdit: any = {};
  
  // ======= OTROS =======
  isEditing: boolean = false;
  searchCategories: string = '';
  searchSubcategories: string = '';
  searchProducts: string = '';
  showMessage: boolean = false;
  message: string = '';
  selectedTab: string = 'categorias';
  userlogged: any = null;

  constructor(
    private categoryService: CategoryServiceService,
    private subcategoryService: SubcategoryServiceService,
    private productService: ProductServiceService,
     private authService: AuthService,
     private userService: userService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userObservable$.subscribe((user: any) => {
      this.userlogged = user;
    });
    this.getCategories();
    this.getSubCategories();
    this.getProducts();
  }

  // ================= CATEGORÍAS =================
  getCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.category = data;
        this.categoryFilter = data;
        this.activeCategories = this.category.filter(cat => cat.state_category === 1);
      },
      error: (err) => console.error('Error al obtener categorías:', err),
    });
  }

  openModalAddCategory(): void {
    this.isEditing = false;
    this.categoryEdit = { name_category: '', state_category: 1 };
    new bootstrap.Modal(document.getElementById('modalEditarCategoria')).show();
  }

  openModalEditCategory(categoria: any): void {
    this.isEditing = true;
    this.categoryEdit = { ...categoria };
    new bootstrap.Modal(document.getElementById('modalEditarCategoria')).show();
  }

  saveChangesCategory(): void {
    if (this.isEditing) {
      this.categoryService.update(this.categoryEdit.id_category, this.categoryEdit).subscribe({
        next: () => {
          this.getCategories();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarCategoria')).hide();
          this.showSuccessMessage('¡Categoría actualizada correctamente!');
        },
        error: () => this.showSuccessMessage('Error al actualizar categoría.'),
      });
    } else {
      this.categoryService.create(this.categoryEdit).subscribe({
        next: () => {
          this.getCategories();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarCategoria')).hide();
          this.showSuccessMessage('¡Categoría añadida correctamente!');
        },
        error: () => this.showSuccessMessage('Error al añadir categoría.'),
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          this.getCategories();
          this.showSuccessMessage('¡Categoría eliminada correctamente!');
        },
        error: () => this.showSuccessMessage('Error al eliminar categoría.'),
      });
    }
  }

  filtrarCategorias(): void {
    const texto = this.searchCategories.toLowerCase();
    this.categoryFilter = this.category.filter(cat =>
      cat.name_category.toLowerCase().includes(texto)
    );
  }

  // ================= SUBCATEGORÍAS =================
  getSubCategories() {
    this.subcategoryService.getAll().subscribe({
      next: (data) => {
        const enriched = data.map((sub: { category_id: any; }) => {
          const categoria = this.category.find(cat => cat.id_category === sub.category_id);
          return { ...sub, nombre_categoria: categoria ? categoria.name_category : 'Sin categoría' };
        });
        this.subcategory = enriched;
        this.subcategoryFilter = enriched;
        this.activeSubcategories = this.subcategory.filter(sub => sub.state_subcategory === 1);
      },
      error: (err) => console.error('Error al obtener subcategorías:', err),
    });
  }

  openModalAddSubcategory(): void {
    this.isEditing = false;
    this.subcategoryEdit = { name_subcategory: '', state_subcategory: 1 };
    new bootstrap.Modal(document.getElementById('modalEditarSubcategoria')).show();
  }

  openModalEditSubcategory(subcategoria: any): void {
    this.isEditing = true;
    this.subcategoryEdit = { ...subcategoria };
    new bootstrap.Modal(document.getElementById('modalEditarSubcategoria')).show();
  }

  saveChangesSubcategory(): void {
    if (this.isEditing) {
      this.subcategoryService.update(this.subcategoryEdit.id_subcategory, this.subcategoryEdit).subscribe({
        next: () => {
          this.getSubCategories();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarSubcategoria')).hide();
          this.showSuccessMessage('¡Subcategoría actualizada correctamente!');
        },
        error: () => this.showSuccessMessage('Error al actualizar subcategoría.'),
      });
    } else {
      this.subcategoryService.create(this.subcategoryEdit).subscribe({
        next: () => {
          this.getSubCategories();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarSubcategoria')).hide();
          this.showSuccessMessage('¡Subcategoría añadida correctamente!');
        },
        error: () => this.showSuccessMessage('Error al añadir subcategoría.'),
      });
    }
  }

  deleteSubcategory(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      this.subcategoryService.delete(id).subscribe({
        next: () => {
          this.getSubCategories();
          this.showSuccessMessage('¡Subcategoría eliminada correctamente!');
        },
        error: () => this.showSuccessMessage('Error al eliminar subcategoría.'),
      });
    }
  }

  filtrarSubcategory(): void {
    const texto = this.searchSubcategories.toLowerCase();
    this.subcategoryFilter = this.subcategory.filter(sub =>
      sub.name_subcategory.toLowerCase().includes(texto)
    );
  }

  // ================= PRODUCTOS =================
getProducts() {
  this.productService.getAll().subscribe({
    next: (data) => {
      const enriched = data.map((product: { category_id: any; subcategory_id: any; }) => {
        // Buscar la categoría
        const categoria = this.category.find(cat => cat.id_category === product.category_id);
        // Buscar la subcategoría
        const subcategoria = this.subcategory.find(sub => sub.id_subcategory === product.subcategory_id);

        return {
          ...product,
          nombre_categoria: categoria ? categoria.name_category : 'Sin categoría',
          nombre_subcategoria: subcategoria ? subcategoria.name_subcategory : 'Sin subcategoría'
        };
      });

      this.products = enriched;
      this.productsFilter = enriched; // Para buscador
    },
    error: (err) => {
      console.error('Error al obtener productos:', err);
    },
  });
}


  openModalAddProduct(): void {
    this.isEditing = false;
    this.productEdit = { name_product: '', state_product: 1 };
    new bootstrap.Modal(document.getElementById('modalEditarProducto')).show();
  }

  openModalEditProduct(producto: any): void {
    this.isEditing = true;
    this.productEdit = " ";
    this.productEdit = { ...producto };
    new bootstrap.Modal(document.getElementById('modalEditarProducto')).show();
  }

  saveChangesProduct(): void {
    if (this.isEditing) {
      this.productService.update(this.productEdit.id_product, this.productEdit).subscribe({
        next: () => {
          this.getProducts();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto')).hide();
          this.showSuccessMessage('¡Producto actualizado correctamente!');
        },
        error: () => this.showSuccessMessage('Error al actualizar producto.'),
      });
    } else {
      this.productService.create(this.productEdit).subscribe({
        next: () => {
          this.getProducts();
          bootstrap.Modal.getInstance(document.getElementById('modalEditarProducto')).hide();
          this.showSuccessMessage('¡Producto añadido correctamente!');
        },
        error: () => this.showSuccessMessage('Error al añadir producto.'),
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.getProducts();
          this.showSuccessMessage('¡Producto eliminado correctamente!');
        },
        error: () => this.showSuccessMessage('Error al eliminar producto.'),
      });
    }
  }

  filterProducts(): void {
    const texto = this.searchProducts.toLowerCase();
    this.productsFilter = this.products.filter(prod =>
      prod.nombre_product.toLowerCase().includes(texto)
    );
  }

// Filtrar subcategorías por categoría seleccionada
filterSubcategoriesByCategory() {
  if (this.productEdit.category_id) {
    this.subcategoryActiveFiltered = this.activeSubcategories.filter(
      (sub: any) => sub.category_id === this.productEdit.category_id
    );
  } else {
    this.subcategoryActiveFiltered = [...this.activeSubcategories];
  }
}
  // ================= UTILS =================
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  showSuccessMessage(msg: string): void {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => (this.showMessage = false), 3000);
  }

  
  logout(event: Event) {
    event.stopPropagation();

    this.authService.logout().subscribe({
      next: () => {
       
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      
      }
    });
  }
}
