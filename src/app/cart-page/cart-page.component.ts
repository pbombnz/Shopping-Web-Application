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
  // displayed when nothing in cart
  message = 'You cart is empty';

  cartItems: CartItem[];
  originalCartItems: number[] = [];
  total = 0;

  constructor(private cartPageService: CartPageService, private router: Router) {
  }

  ngOnInit() {
    this.getCartItems();
  }

  getCartItems(): void {
    console.log('Get cart items');
    this.cartPageService.getCartItems()
      .subscribe(items => {
        this.cartItems = items;

        // clone array
        for (let i = 0; i < this.cartItems.length; i++) {
          this.originalCartItems.push(this.cartItems[i].quantity);
        }

        this.calculateTotalPrice();
      });
  }

  calculateTotalPrice() {
    this.total = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      console.log(this.cartItems[i]);
      this.total += (this.cartItems[i].item_price * this.cartItems[i].quantity);
    }
  }

  add(pid) {
    console.log(pid);
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid) {
        this.cartItems[i].quantity += 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }

  del(pid) {
    console.log(pid);
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid && this.cartItems[i].quantity - 1 !== 0) {
        this.cartItems[i].quantity -= 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }

  delpopup(pid) {
    console.log(pid);
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid) {
        this.cartItems.splice(i, 1);
      }
    }
    this.calculateTotalPrice();
  }

  checkout() {
    let modifiedQuantity = false;

    for (let i = 0; i < this.cartItems.length; i++) {
      console.log('LOOP');
      console.log('original: ' + this.originalCartItems[i] + ' | normal: ' + this.cartItems[i].quantity);
      if (this.cartItems[i].quantity !== this.originalCartItems[i]) {
        modifiedQuantity = true;
        break;
      }
    }

    if (!modifiedQuantity) {
      console.log(' did not modified quantity');
      this.router.navigate(['/payment-page']);
    } else {
      console.log('modified quantity');
      this.cartPageService.updateCartItems(this.cartItems).subscribe(() => {
        this.router.navigate(['/payment-page']);
      }
    );
    }

  }
}
