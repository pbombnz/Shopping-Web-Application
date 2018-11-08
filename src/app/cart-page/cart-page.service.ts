import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from './cart-item';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartPageService {

  constructor(private http: HttpClient) { }

  getCartItems (): Observable<CartItem[]> {
    return this.http.get<CartItem[]>('api/current_user_cart')
      .pipe(
        map(result => {
          for(let i =0; i < result.length;i++) {
            result[i].item_price = Number.parseFloat(result[i].item_price.toString().substr(1));
          }

          return result;
        })
       
      );
  }
}
