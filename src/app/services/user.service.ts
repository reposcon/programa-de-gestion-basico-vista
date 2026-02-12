import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class userService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  private userSubject = new BehaviorSubject<any>(null);
  public userObservable$ = this.userSubject.asObservable();


  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  create(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  notifyUserChange(user: any) {
    this.userSubject.next(user);
  }

}
