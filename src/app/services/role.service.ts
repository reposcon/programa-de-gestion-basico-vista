import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Role } from '../models/role.model';
import { MI_URL_DE_RAILWAY } from '../api-config'; // 1. Importas la base

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // 2. Reemplazas el localhost por la base + /roles
  private apiUrl = `${MI_URL_DE_RAILWAY}/roles`;

  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Los métodos usan "this.apiUrl", así que ya apuntan a Railway automáticamente
  loadRoles(): void {
    this.http.get<Role[]>(this.apiUrl).subscribe({
      next: (roles) => this.rolesSubject.next(roles),
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  create(role: Partial<Role>): Observable<any> {
    return this.http.post(this.apiUrl, role).pipe(
      tap(() => this.loadRoles())
    );
  }

  update(id: number, role: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, role).pipe(
      tap(() => this.loadRoles())
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadRoles())
    );
  }

  get currentRolesValue(): Role[] {
    return this.rolesSubject.value;
  }
}