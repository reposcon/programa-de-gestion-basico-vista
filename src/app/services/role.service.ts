import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://127.0.0.1:8000/api/roles';

  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadRoles(): void {
    this.http.get<Role[]>(this.apiUrl).subscribe({
      next: (roles) => this.rolesSubject.next(roles),
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  create(role: Partial<Role>): Observable<any> {
    return this.http.post(this.apiUrl, role).pipe(
      tap(() => this.loadRoles()) // Recarga la lista automáticamente al crear
    );
  }

  update(id: number, role: Role): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, role).pipe(
      tap(() => this.loadRoles()) // Recarga la lista automáticamente al editar
    );
  }


  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadRoles()) // Recarga la lista automáticamente al desactivar
    );
  }

  get currentRolesValue(): Role[] {
    return this.rolesSubject.value;
  }
}