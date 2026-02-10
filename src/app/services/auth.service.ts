import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api'; // Ajusta según tu backend
    private currentUserSubject = new BehaviorSubject<any>(null);

   constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  login(name_user: string, password_user: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { name_user, password_user });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
}
