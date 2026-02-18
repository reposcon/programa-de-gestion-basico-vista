import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryServiceService } from '../../../services/category-service.service';
import { userService } from '../../../services/user.service';
import { Category } from '../../../models/category.model';
import { ToolService } from '../../../services/tool.service';
import { UiMessageService } from '../../../services/ui-message.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-category-page',
  standalone: false,
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoriesFiltered: Category[] = [];
  selectedCategory: Partial<Category> = {};

  // Columnas desde el ToolService
  columns: any[] = [];

  userlogged: any = null;
  private userSub!: Subscription;

  constructor(
    private categoryService: CategoryServiceService,
    private userService: userService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    // Definimos qué columnas queremos ver
    this.columns = this.toolservice.getColumns('categories');

    this.userSub = this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
      if (this.userlogged && this.authService.hasPermission('view_categories')) {
        this.getCategories();
      }
    });

    this.toolservice.update$.subscribe(() => {
      if (this.authService.hasPermission('view_categories')) {
        this.getCategories();
      }
    });
  }

  // TODA TU LÓGICA DE NEGOCIO SE QUEDA IGUAL
  getCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.filterCategory(''); // Inicializamos el filtro
      },
      error: err => console.error(err)
    });
  }

  toggleCategory(cat: Category): void {
    const isActive = cat.state_category === 1;
    this.toolservice.confirm({
      title: isActive ? '¿Desactivar categoría?' : '¿Restaurar categoría?',
      text: isActive ? `La categoría "${cat.name_category}" quedará inactiva` : `La categoría "${cat.name_category}" será restaurada`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (confirmed) {
        this.categoryService.toggle(cat.id_category).subscribe({
          next: () => {
            this.toolservice.notifyUpdate();
            this.uiMessage.show(isActive ? 'Categoría desactivada' : 'Categoría restaurada', 'success');
          }
        });
      }
    });
  }

  filterCategory(term: string): void {
    const search = term.toLowerCase();
    this.categoriesFiltered = this.categories
      .filter(cat => cat.name_category?.toLowerCase().includes(search))
      .sort((a, b) => b.state_category - a.state_category);
  }

  openAddModal() { this.selectedCategory = { name_category: '', state_category: 1 }; }
  openEditModal(category: Category) { this.selectedCategory = { ...category }; }
  onCategorySaved(msg: string) { this.getCategories(); /* Tu lógica de mensaje */ }

  ngOnDestroy(): void { this.userSub?.unsubscribe(); }
}
