import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/paymentMethod.model';
import { TaxSetting } from '../models/TaxSetting.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8000/api/sales';
  private configUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(`${this.configUrl}/paymentmethods`);
  }

  getTaxSettings(): Observable<TaxSetting[]> {
    return this.http.get<TaxSetting[]>(`${this.configUrl}/tax-settings`);
  }

  createSale(saleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleData);
  }

  downloadInvoice(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/invoice`, { responseType: 'blob' });
  }
}