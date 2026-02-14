import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {

  userSub: any = {};
  userlogged: any = {};
  constructor(
    public authService: AuthService,
    private router: Router

  ) { }

  ngOnInit(): void {

    this.authService.currentUser$.subscribe(user => {
      this.userlogged = user;
    });
  }
  openHome() {
    if (this.userlogged) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/login']);
    }
  }


}
