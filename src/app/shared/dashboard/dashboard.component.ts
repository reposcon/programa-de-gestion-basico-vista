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
  logout(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.authService.logout();
  }
}