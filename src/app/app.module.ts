import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoadingInterceptor } from './core/loading/loading.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Librerías externas
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgSelectModule } from '@ng-select/ng-select';

// Componentes Base
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

// Páginas
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ProductPageComponent } from './modules/products/product-page/product-page.component';
import { SubcategoryPageComponent } from './modules/subcategories/subcategory-page/subcategory-page.component';
import { CategoryPageComponent } from './modules/categories/category-page/category-page.component';
import { CrudUsersComponent } from './modules/crud-users/crud-users.component';

// Modales
import { ModalEditCategoriesComponent } from './shared/modals/modals categories/modal-edit-categories/modal-edit-categories.component';
import { ModalAddProductComponent } from './shared/modals/modals products/modal-add-products/modal-add-products.component';
import { ModalEditProductsComponent } from './shared/modals/modals products/modal-edit-products/modal-edit-products.component';
import { ModalAddSubcategoryComponent } from './shared/modals/modals subcategorias/modal-add-subcategories/modal-add-subcategories.component';
import { ModalEditSubcategoriesComponent } from './shared/modals/modals subcategorias/modal-edit-subcategories/modal-edit-subcategories.component';
import { ModalAddCategoriesComponent } from './shared/modals/modals categories/modal-add-categories/modal-add-categories.component';
import { ModalEditUserComponent } from './shared/modals/modals users/modal-edit-user/modal-edit-user.component';
import { ModalAddUserComponent } from './shared/modals/modals users/modal-add-user/modal-add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ModalEditCategoriesComponent,
    ModalAddProductComponent,
    ModalEditProductsComponent,
    ModalAddSubcategoryComponent,
    ModalEditSubcategoriesComponent,
    ModalAddCategoriesComponent,
    ProductPageComponent,
    SubcategoryPageComponent,
    CategoryPageComponent,
    CrudUsersComponent,
    ModalEditUserComponent,
    ModalAddUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    FullCalendarModule

  ],
  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }