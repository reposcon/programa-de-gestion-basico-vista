import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { MI_URL_DE_RAILWAY } from '../api-config'; // 1. Importamos la base

@Injectable({ providedIn: 'root' })
export class userService {
  // 2. Cambiamos el localhost por la constante (que ya trae el /api)
  private apiUrl = MI_URL_DE_RAILWAY;

  private userSubject = new BehaviorSubject<any>(null);
  public userObservable$ = this.userSubject.asObservable();
  private rolesSubject = new BehaviorSubject<any[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  notifyUserChange(user: any) {
    this.userSubject.next(user);
  }

  // Los métodos ahora llamarán a Railway automáticamente
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  create(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  update(id: number, data: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }
}