import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MI_URL_DE_RAILWAY } from '../api-config'; 

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  private apiUrl = `${MI_URL_DE_RAILWAY}/products`;

  constructor(private http: HttpClient) { }

  
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  create(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  deactivate(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { state_product: 0 });
  }

  toggle(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/toggle`, {});
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/template`, { responseType: 'blob' });
  }

  importExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/import`, formData);
  }

  getAiInsights(): Observable<any> {
    const aiUrl = `${MI_URL_DE_RAILWAY}/inventory/ai-insights`;
    return this.http.get(aiUrl);
  }
}