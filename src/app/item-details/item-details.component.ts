import { Component, OnInit } from '@angular/core';
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
  readonly min = 0;
  readonly max = 50;

  itemQuantity = 0;

  itemID;
  item;
  userInfo;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private browseItemsService: BrowseItemsService, private apiService: APIService) { }

  ngOnInit() {

    // reference: https://stackoverflow.com/questions/41496316/get-active-route-data-inside-router-events
    this.itemID = this.activeRoute.snapshot.params.id;

    // get item by id
    this.browseItemsService.getItemByID(this.itemID)
    .subscribe(item => this.item = item[0]);
 
  }


  onQuantityMinusClick() {
    this.itemQuantity--;
  }

  onQuantityPlusClick() {
    this.itemQuantity++;
  }

  onSubmitClick(){
    console.log("submit");

    // check if user is logged in, else redirect to login page.
    if( !this.apiService.isAuthenticated() ){
      
      console.log("redirect to login page");
    }
    else{
      console.log("add to cart");
      this.browseItemsService.addItemToCart(this.itemID);
    }

  }
}
