import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubcategoryServiceService } from '../../../services/subcategory-service.service';
import { CategoryServiceService } from '../../../services/category-service.service';
import { userService } from '../../../services/user.service';
import { Category } from '../../../models/category.model';
import { Subcategory } from '../../../models/subcategory.model';
import { ToolService } from '../../../services/tool.service';
import { UiMessageService } from '../../../services/ui-message.service';

@Component({
  selector: 'app-subcategory-page',
  standalone: false,
  templateUrl: './subcategory-page.component.html',
  styleUrls: ['./subcategory-page.component.css'],
})
export class SubcategoryPageComponent implements OnInit, OnDestroy {

  subcategories: (Subcategory & { name_category: string; categoryActive: boolean; isActive: boolean })[] = [];
  subcategoriesFiltered: (Subcategory & { name_category: string; categoryActive: boolean; isActive: boolean })[] = [];
  categories: Category[] = [];
  selectedSubcategory: Partial<Subcategory> = {};

  searchSubcategories = '';
  showMessage = false;
  message = '';

  pageSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  userlogged: any = null;
  private userSub!: Subscription;

  constructor(
    private subcategoryService: SubcategoryServiceService,
    private categoryService: CategoryServiceService,
    private userService: userService,
    private toolservice: ToolService,
    private uiMessage: UiMessageService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();

    this.toolservice.update$.subscribe(() => {
      this.categoryService.getAll().subscribe(cats => {
        this.categories = cats;
        this.getSubCategories();
      });
    });

    this.userSub = this.userService.userObservable$.subscribe(user => this.userlogged = user);
  }
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  loadInitialData(): void {
    this.categoryService.getAll().subscribe({
      next: cats => {
        this.categories = cats;
        this.getSubCategories();
      },
      error: err => console.error(err)
    });
  }

  getSubCategories(): void {
    this.subcategoryService.getAll().subscribe({
      next: subs => {
        this.subcategories = subs.map((sub: Subcategory) => {
          const category = this.categories.find(c => c.id_category === sub.category_id);
          return {
            ...sub,
            name_category: category?.name_category ?? 'Sin categoría',
            categoryActive: category?.state_category === 1,
            isActive: sub.state_subcategory === 1
          };
        });
        this.applyFiltersAndOrder();
      },
      error: err => console.error(err)
    });
  }

  toggleSubcategory(
    sub: Subcategory & {
      categoryActive: boolean;
      isActive: boolean;
    }
  ): void {

    const isActive = sub.state_subcategory === 1;

    this.toolservice.confirm({
      title: isActive ? '¿Desactivar subcategoría?' : '¿Restaurar subcategoría?',
      text: isActive
        ? `La subcategoría "${sub.name_subcategory}" quedará inactiva`
        : `La subcategoría "${sub.name_subcategory}" será restaurada`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;

      this.subcategoryService.toggle(sub.id_subcategory).subscribe({
        next: () => {
          sub.isActive = !isActive;
          sub.state_subcategory = sub.isActive ? 1 : 0;

          this.applyFiltersAndOrder();

          this.uiMessage.show(
            isActive
              ? 'Subcategoría desactivada correctamente'
              : 'Subcategoría restaurada correctamente',
            'success'
          );

          this.toolservice.notifyUpdate();
        },
        error: (err) => {
          this.uiMessage.show(
            err?.error?.message || 'Error al actualizar la subcategoría',
            'warning'
          );
        }
      });
    });
  }

  applyFiltersAndOrder(): void {
    const search = this.searchSubcategories.toLowerCase();
    this.subcategoriesFiltered = this.subcategories
      .filter(sub => sub.name_subcategory?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
    this.currentPage = 1;
  }

  openAddModal(): void {
    this.selectedSubcategory = { name_subcategory: '', state_subcategory: 1, category_id: 0 };
  }

  openEditModal(sub: Subcategory): void {
    this.selectedSubcategory = { ...sub };
  }

  onSubcategorySaved(msg: string): void {
    this.getSubCategories();
    this.showSuccessMessage(msg);
  }

  showSuccessMessage(msg: string): void {
    this.message = msg;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 3000);
  }

  get paginatedSubcategories() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.subcategoriesFiltered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.subcategoriesFiltered.length / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}