import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { userService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class DashboardComponent implements OnInit {
  currentTab: string = 'pos'; 
  today: Date = new Date();
  userlogged: any = null;

  constructor(
    public authService: AuthService,
    private userService: userService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userlogged = this.authService.getCurrentUser();
    this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
    });
  }


  getTitle(): string {
    switch (this.currentTab) {
      case 'pos': return 'Punto de Venta';
      case 'products': return 'Gestión de Productos';
      case 'subcategories': return 'Gestión de Subcategorías'; 
      case 'categories': return 'Gestión de Categorías';
      case 'usermanagement': return 'Gestión de Usuarios'; 
      default: return 'Panel de Control';
    }
  }

  logout(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.authService.logout();
  }
}