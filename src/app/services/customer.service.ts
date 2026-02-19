import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerService {
    private apiUrl = 'http://127.0.0.1:8000/api/customers';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Customer[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(res => res.data ? res.data : res)
        );
    }

    getCustomers(): Observable<Customer[]> {
        return this.getAll();
    }

    createCustomer(customer: Customer): Observable<any> {
        return this.http.post<any>(this.apiUrl, customer);
    }

    updateCustomer(id: number, customer: Customer): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
    }

    toggle(id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/toggle`, {});
    }
}