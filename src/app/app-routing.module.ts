import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { CrudUsersComponent } from './modules/crud-users/crud-users.component';

import { authGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [

  // 🔐 Login
  { path: 'login', component: LoginComponent },

  // 🏠 Home (logueado)
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  // 👤 Gestión de usuarios (solo admin)
  {
    path: 'usermanagement',
    component: CrudUsersComponent,
    canActivate: [authGuard, AdminGuard]
  },

  // 🔁 Ruta raíz
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🚑 Fallback
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
export class AppRoutingModule {}
