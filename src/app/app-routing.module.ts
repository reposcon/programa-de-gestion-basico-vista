import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { CrudUsersComponent } from './modules/crud-users/crud-users.component';
import { SubcategoryPageComponent } from './modules/subcategories/subcategory-page/subcategory-page.component';
import { CategoryPageComponent } from './modules/categories/category-page/category-page.component';
import { ProductPageComponent } from './modules/products/product-page/product-page.component';

import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'home',
    component: HomeComponent, // Este es tu Dashboard
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];
const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
