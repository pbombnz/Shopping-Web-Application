import { Component, OnInit } from '@angular/core';
import { CartItem } from './cart-item';
import { CartPageService } from './cart-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  //displayed when nothing in cart
  message = "You cart is empty";
  
  cartItems: CartItem[];
  total: number = 0;

  constructor(private cartPageService: CartPageService, private router: Router) {
  }

  ngOnInit() {
    this.getCartItems();
  }

  getCartItems(): void {
    this.cartPageService.getCartItems()
      .subscribe(items => {
        this.cartItems = items;
        console.log(this.cartItems)
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

  add(pid) {
    console.log(pid);
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid) {
        this.cartItems[i].quantity += 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }

  del(pid) {
    console.log(pid);
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid && this.cartItems[i].quantity-1 != 0) {
        this.cartItems[i].quantity -= 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }

  checkout(){
    // this.cartPageService.updateCartItems(this.cartItems).subscribe(()=>{
      this.router.navigate(['/payment-page']);
    // })
  }
}
