import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart-item';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartPageService {

  constructor(private http: HttpClient) { }

  getCartItems (): Observable<CartItem[]> {
    return this.http.get<CartItem[]>('/api/current_user_cart')
      .pipe(
       
      );
  }
}
