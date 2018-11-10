import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartPageService } from '../cart-page/cart-page.service';
import { CartItem } from '../cart-page/cart-item';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  cartItems: CartItem[];
  total: number = 0;
  
  constructor(private router: Router, private cartPageService: CartPageService) { }

  ngOnInit() {
  }

  getCartItems(): void {
    this.cartPageService.getCartItems()
      .subscribe(items => {
        this.cartItems = items;
        this.calculateTotalPrice();
      })
  }

  calculateTotalPrice() {
    this.total = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      console.log(this.cartItems[i]);
      this.total += (this.cartItems[i].item_price * this.cartItems[i].quantity);
    }
  }

  backToCart(){
    this.router.navigate(['/cart-page']);
  }
}
