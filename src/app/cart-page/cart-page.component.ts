import { Component, OnInit } from '@angular/core';
import { Item } from '../browse-items/browse-items';
import { CartItem } from './cart-item';
import { CartPageService } from './cart-page.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  title = 'My Cart';

  //displayed when nothing in cart
  message = "You cart is empty";
  
  cartItems: CartItem[];
  //selectedProduct: Subject<any> = new Subject;
  total: number = 0;

  constructor(private cartPageService: CartPageService) {
  }

  ngOnInit() {
    this.getCartItems();
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

  // getpopup(det) {
  //   this.selectedProduct.next(det);
  // }

  delpopup(pid) {
    console.log(pid);
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid) {
        this.cartItems.splice(i, 1);
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
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
      if (this.cartItems[i].item_id === pid) {
        this.cartItems[i].quantity -= 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }
}
