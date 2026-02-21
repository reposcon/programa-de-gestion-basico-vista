import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MI_URL_DE_RAILWAY } from '../api-config'; // 1. Importas la base

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = `${MI_URL_DE_RAILWAY}/reports`;

    constructor(private http: HttpClient) { }
    
    checkStatus(): Observable<any> {
        return this.http.get(`${this.apiUrl}/status`);
    }

    openSession(amount: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/open`, { opening_amount: amount });
    }

    closeSession(): Observable<any> {
        return this.http.post(`${this.apiUrl}/close`, {});
    }

    getHistory(): Observable<any> {
        return this.http.get(`${this.apiUrl}/history`);
    }
}