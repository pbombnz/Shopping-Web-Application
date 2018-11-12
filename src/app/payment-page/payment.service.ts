import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../cart-page/cart-item';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  placeOrder (body: {}): Observable<CartItem[]> {
    return this.http.put('api/place_order', body)
      .pipe( tap((result: any) => console.log(result))
      );
    }
}
