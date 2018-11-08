import { Component, OnInit } from '@angular/core';
import { Item } from '../browse-items/browse-items';
import { CartItem } from './cart-item';

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
  upproducts: CartItem[] = [];
  //selectedProduct: Subject<any> = new Subject;
  total: number = 0;

  constructor() {
    this.cartItems = [
      {
        order_id: 1,
        item_id: 0,
        quantity: 1
      }
    ];
  }

  ngOnInit() {
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.total = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      //TODO: fix price
      //this.total += (this.cartItems[i].item_price * this.cartItems[i].quantity);
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
