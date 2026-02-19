import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    private apiUrl = 'http://127.0.0.1:8000/api/reports';

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