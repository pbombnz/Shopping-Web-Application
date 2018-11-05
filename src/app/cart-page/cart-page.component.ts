import { Component, OnInit } from '@angular/core';
import { Item } from '../browse-items/browse-items';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  title = 'My Cart';

  message = "You cart is empty";
  
  //TODO: use CartItem type?? fix item_stock_quantity
  cartItems: Item[];
  upproducts: Item[] = [];
  //selectedProduct: Subject<any> = new Subject;
  total: number = 0;

  constructor() {
    this.cartItems = [
      {
        item_id: 0,
        item_name: 'Onion',
        item_category: 3,
        item_origin: 'China',
        item_price: 5.99,
        item_stock_quantity: 100,
        item_image: '/src/assets/vegetables/onion.jpg'
      }
    ];
  }

  ngOnInit() {
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.total = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      this.total += (this.cartItems[i].item_price * this.cartItems[i].item_stock_quantity);
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
        this.cartItems[i].item_stock_quantity += 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }

  del(pid) {
    console.log(pid);
    for (var i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].item_id === pid) {
        this.cartItems[i].item_stock_quantity -= 1;
      }
    }
    this.calculateTotalPrice();
    console.log(this.cartItems);
  }
}
