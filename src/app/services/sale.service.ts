import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/paymentMethod.model';
import { TaxSetting } from '../models/TaxSetting.model';
import { MI_URL_DE_RAILWAY } from '../api-config'; // 1. Importamos la constante

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  // 2. Usamos la constante para ambas URLs
  private apiUrl = `${MI_URL_DE_RAILWAY}/sales`;
  private configUrl = MI_URL_DE_RAILWAY; 

  constructor(private http: HttpClient) {}

  // Los métodos se actualizan automáticamente
  getSales(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPaymentMethods(): Observable<PaymentMethod[]> {
    // Esto conectará a /api/paymentmethods en Railway
    return this.http.get<PaymentMethod[]>(`${this.configUrl}/paymentmethods`);
  }

  getTaxSettings(): Observable<TaxSetting[]> {
    // Esto conectará a /api/tax-settings en Railway
    return this.http.get<TaxSetting[]>(`${this.configUrl}/tax-settings`);
  }

  createSale(saleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleData);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, { responseType: 'blob' });
  }
}