// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes , ExtraOptions } from '@angular/router';


// Importa tus componentes de página
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CrudUserComponent } from './pages/crud-user/crud-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'usersManagement', component: CrudUserComponent },
];
const routerOptions: ExtraOptions = {
  onSameUrlNavigation: 'reload',  // Fuerza recarga si navegas a la misma URL
  scrollPositionRestoration: 'enabled' // Opcional: para restaurar scroll
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
