import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Item } from '../browse-items/browse-items';
import { BrowseItemsService } from '../browse-items/browse-items.service';
import { APIService } from '../services/api.service';


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  readonly min = 1;
  readonly max = 50;

  itemQuantity = 1;

  itemID;
  item;
  userInfo;

  constructor(private router: Router, private activeRoute: ActivatedRoute,
    private browseItemsService: BrowseItemsService, private apiService: APIService) { }

  ngOnInit() {
    // reference: https://stackoverflow.com/questions/41496316/get-active-route-data-inside-router-events
    this.itemID = this.activeRoute.snapshot.params.id;

    // get item by id
    this.browseItemsService.getItemByID(this.itemID).subscribe(item => this.item = item);
  }


  onQuantityMinusClick() {
    if (this.itemQuantity <= this.min) { return; }
    this.itemQuantity--;
  }

  onQuantityPlusClick() {
    if (this.itemQuantity >= this.max) { return; }
    this.itemQuantity++;
  }

  onSubmitClick() {

    // check if quantity is of valid size
    if (this.itemQuantity <= 0) {
      console.log('cannot submit item to cart of size ' + this.itemQuantity);
      this.itemQuantity = 1;
      return;
    }



    // check if user is logged in, else redirect to login page.
    if ( !this.apiService.isAuthenticated() ) {

      console.log('redirect to login page');
      this.router.navigate(['/login']);
    } else {
      console.log('add to cart');
      this.browseItemsService.addItemToCart(this.itemID, this.itemQuantity).subscribe(() => {
        this.router.navigate(['/cart-page']);
      });

    }

  }
}
