import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name_user: string = '';
  password_user: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: userService   // inyecta Servicio de usuarios
  ) { }

  login(): void {
    this.errorMessage = '';
    this.loading = true;

    if (!this.name_user || !this.password_user) {
      this.errorMessage = 'Por favor ingresa usuario y contraseña';
      this.loading = false;
      return;
    }

    this.authService.login(this.name_user, this.password_user).subscribe({
      next: (response: any) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.userService.notifyUserChange(response.user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else if (err.status === 403) {
          this.errorMessage = 'Usuario inactivo';
        } else {
          this.errorMessage = 'Error en el servidor. Intenta luego.';
        }
        this.loading = false;
        console.error('Error login:', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
