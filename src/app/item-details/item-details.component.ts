import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Item } from '../browse-items/browse-items';
import { BrowseItemsService } from '../browse-items/browse-items.service';


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

  constructor(private router: Router, private activeRoute: ActivatedRoute, private browseItemsService: BrowseItemsService) { }

  ngOnInit() {
    this.itemID = this.activeRoute.params._value.id;

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
}
