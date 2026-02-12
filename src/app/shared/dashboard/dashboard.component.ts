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

  today: Date = new Date();
  userlogged: any = null;

  constructor(
    private authService: AuthService,
    private userService: userService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.userObservable$.subscribe(user => {
      this.userlogged = user;
    });
  }

  openUsers() {
    this.router.navigate(['/usermanagement']);
  }
  logout(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.authService.logout();
  }

}