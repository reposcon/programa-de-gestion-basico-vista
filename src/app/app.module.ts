import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para usar [(ngModel)]
import { AppRoutingModule } from './app-routing.module'; // Importar el módulo de enrutamiento
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule, NgSelectConfig } from '@ng-select/ng-select';;

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CrudUserComponent } from './pages/crud-user/crud-user.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CrudUserComponent
  ],exports: [
    HeaderComponent,
    DashboardComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CrudUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    FullCalendarModule,
     ReactiveFormsModule,
    HttpClientModule,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
