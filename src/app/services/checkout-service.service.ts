import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {

  private purchaseUrl = 'http://localhost:8080/checkout/purchase';

  constructor(private http: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
     return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }
}
