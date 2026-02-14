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

  categories: (Category & { isActive: boolean })[] = [];
  categoriesFiltered: (Category & { isActive: boolean })[] = [];
  selectedCategory: Partial<Category> = {};

  searchCategories = '';
  showMessage = false;
  message = '';

  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

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
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  getCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data: Category[]) => {
        this.categories = data.map(cat => ({
          ...cat,
          isActive: cat.state_category === 1
        }));
        this.applyFiltersAndOrder();
      },
      error: err => console.error(err)
    });
  }

  toggleCategory(cat: Category): void {

    const isActive = cat.state_category === 1;

    this.toolservice.confirm({
      title: isActive ? '¿Desactivar categoría?' : '¿Restaurar categoría?',
      text: isActive
        ? `La categoría "${cat.name_category}" quedará inactiva`
        : `La categoría "${cat.name_category}" será restaurada`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;

      this.categoryService.toggle(cat.id_category).subscribe({
        next: () => {
          this.toolservice.notifyUpdate();
          this.uiMessage.show(
            isActive
              ? 'Categoría desactivada correctamente'
              : 'Categoría restaurada correctamente',
            'success'
          );
        },
        error: (err) => {
          this.uiMessage.show(
            err?.error?.message || 'Error al actualizar la categoría',
            'warning'
          );
        }
      });
    });
  }

  applyFiltersAndOrder(): void {
    const search = this.searchCategories.toLowerCase();
    this.categoriesFiltered = this.categories
      .filter(cat => cat.name_category?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
    this.currentPage = 1;
  }

  openAddModal() {
    this.selectedCategory = { name_category: '', state_category: 1 };
  }

  openEditModal(category: Category) {
    this.selectedCategory = { ...category };
  }

  onCategorySaved(msg: string) {
    this.getCategories();
    this.showSuccessMessage(msg);
  }

  showSuccessMessage(msg: string) {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 3000);
  }

  filterCategory(): void {
    this.applyFiltersAndOrder();
  }

  get paginatedCategories() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.categoriesFiltered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.categoriesFiltered.length / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}
