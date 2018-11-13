import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete-page',
  templateUrl: './order-complete-page.component.html',
  styleUrls: ['./order-complete-page.component.css']
})
export class OrderCompletePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewOrders() {
    this.router.navigate(['/orders-page']);
  }
}
