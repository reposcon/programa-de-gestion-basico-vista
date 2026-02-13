import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(name_user: string, password_user: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { name_user, password_user }).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    const token = this.getToken();

    if (!token) {
      this.clearLocalStorage();
      return;
    }

    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => console.log('Sesión cerrada en servidor'),
      error: (err) => console.error('Servidor no pudo revocar token (posiblemente ya expiró)'),
      complete: () => {
      }
    });

    this.clearLocalStorage();
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}