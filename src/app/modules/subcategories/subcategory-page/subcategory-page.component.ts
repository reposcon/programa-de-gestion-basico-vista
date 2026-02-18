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
  subcategories: any[] = [];
  subcategoriesFiltered: any[] = [];
  categories: Category[] = [];
  selectedSubcategory: Partial<Subcategory> = {};
  
  columns: any[] = []; // Inyectamos las columnas aquí
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
    this.columns = this.toolservice.getColumns('subcategories'); // Cargar config de columnas
    this.loadInitialData();

    this.toolservice.update$.subscribe(() => {
      this.categoryService.getAll().subscribe(cats => {
        this.categories = cats;
        this.getSubCategories();
      });
    });

    this.userSub = this.userService.userObservable$.subscribe(user => this.userlogged = user);
  }

  // Mantenemos tu lógica de carga de datos original
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
        this.applyFiltersAndOrder(''); // Iniciamos el filtro
      }
    });
  }

  // Tu lógica de Toggle intacta
  toggleSubcategory(sub: any): void {
    const isActive = sub.state_subcategory === 1;
    this.toolservice.confirm({
      title: isActive ? '¿Desactivar subcategoría?' : '¿Restaurar subcategoría?',
      text: isActive ? `La subcategoría "${sub.name_subcategory}" quedará inactiva` : `La subcategoría "${sub.name_subcategory}" será restaurada`,
      confirmText: isActive ? 'Desactivar' : 'Restaurar',
      icon: 'warning'
    }).then(confirmed => {
      if (!confirmed) return;
      this.subcategoryService.toggle(sub.id_subcategory).subscribe({
        next: () => {
          this.toolservice.notifyUpdate();
          this.uiMessage.show(isActive ? 'Subcategoría desactivada' : 'Subcategoría restaurada', 'success');
        }
      });
    });
  }

  applyFiltersAndOrder(term: string): void {
    const search = term.toLowerCase();
    this.subcategoriesFiltered = this.subcategories
      .filter(sub => sub.name_subcategory?.toLowerCase().includes(search))
      .sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }

  openAddModal(): void {
    this.selectedSubcategory = { name_subcategory: '', state_subcategory: 1, category_id: 0 };
  }

  openEditModal(sub: Subcategory): void {
    this.selectedSubcategory = { ...sub };
  }

  onSubcategorySaved(msg: string): void {
    this.getSubCategories();
    // Aquí puedes usar tu showSuccessMessage o el uiMessage
    this.uiMessage.show(msg, 'success');
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}