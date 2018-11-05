import { Component, OnInit } from '@angular/core';
import { Item } from '../browse-items/browse-items';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cartItems: Item[];

  message = "You cart is empty";
  
  constructor() { }

  ngOnInit() {
  }

}
