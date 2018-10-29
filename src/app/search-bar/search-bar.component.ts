import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, switchMap, catchError} from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Item } from '../browse-items/browse-items';
import { BrowseItemsService } from '../browse-items/browse-items.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  @ViewChild('input')
  inputRef: ElementRef;

  searchQuery: string;
  searching = false;
  searchFailed = false;

  // tslint:disable:max-line-length
  _items: any[] = [
    {'item_id': 1, 'item_name': 'V8 Splash Strawberry Banana', 'item_category': 1, 'item_origin': 'China', 'item_price': '3.91', 'item_stock_quantity': 68, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 2, 'item_name': 'Island Oasis - Ice Cream Mix', 'item_category': 2, 'item_origin': 'Brazil', 'item_price': '1.60', 'item_stock_quantity': 40, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 3, 'item_name': 'Pineapple - Canned, Rings', 'item_category': 2, 'item_origin': 'France', 'item_price': '19.14', 'item_stock_quantity': 26, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 4, 'item_name': 'Doilies - 5, Paper', 'item_category': 0, 'item_origin': 'Kosovo', 'item_price': '12.06', 'item_stock_quantity': 10, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 5, 'item_name': 'Wine - Harrow Estates, Vidal', 'item_category': 1, 'item_origin': 'Indonesia', 'item_price': '9.38', 'item_stock_quantity': 23, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 6, 'item_name': 'Cheese - Mozzarella', 'item_category': 0, 'item_origin': 'Uruguay', 'item_price': '10.23', 'item_stock_quantity': 13, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 7, 'item_name': 'Beer - Sleemans Honey Brown', 'item_category': 1, 'item_origin': 'China', 'item_price': '12.55', 'item_stock_quantity': 64, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 8, 'item_name': 'Sugar Thermometer', 'item_category': 1, 'item_origin': 'Venezuela', 'item_price': '10.46', 'item_stock_quantity': 42, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 9, 'item_name': 'Juice - V8, Tomato', 'item_category': 2, 'item_origin': 'Ireland', 'item_price': '14.19', 'item_stock_quantity': 4, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 10, 'item_name': 'Tofu - Soft', 'item_category': 0, 'item_origin': 'France', 'item_price': '10.31', 'item_stock_quantity': 62, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 11, 'item_name': 'Sambuca - Ramazzotti', 'item_category': 2, 'item_origin': 'Poland', 'item_price': '14.30', 'item_stock_quantity': 36, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 12, 'item_name': 'Cheese - Taleggio D.o.p.', 'item_category': 2, 'item_origin': 'Brazil', 'item_price': '12.78', 'item_stock_quantity': 98, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 13, 'item_name': 'Paper Towel Touchless', 'item_category': 0, 'item_origin': 'Russia', 'item_price': '16.48', 'item_stock_quantity': 56, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 14, 'item_name': 'Bread - Dark Rye', 'item_category': 0, 'item_origin': 'Malta', 'item_price': '12.16', 'item_stock_quantity': 17, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 15, 'item_name': 'Coffee - Decafenated', 'item_category': 2, 'item_origin': 'Russia', 'item_price': '11.74', 'item_stock_quantity': 38, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 16, 'item_name': 'Wine - Rosso Del Veronese Igt', 'item_category': 0, 'item_origin': 'China', 'item_price': '14.69', 'item_stock_quantity': 91, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 17, 'item_name': 'Snapple Raspberry Tea', 'item_category': 0, 'item_origin': 'China', 'item_price': '10.39', 'item_stock_quantity': 3, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 18, 'item_name': 'Eggplant Oriental', 'item_category': 1, 'item_origin': 'France', 'item_price': '8.39', 'item_stock_quantity': 0, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 19, 'item_name': 'Carrots - Jumbo', 'item_category': 1, 'item_origin': 'Indonesia', 'item_price': '17.87', 'item_stock_quantity': 25, 'item_image': 'assets/vegetables/beans.jpg' },
  {'item_id': 20, 'item_name': 'Beer - Steamwhistle', 'item_category': 1, 'item_origin': 'Greece', 'item_price': '11.14', 'item_stock_quantity': 59, 'item_image': 'assets/vegetables/beans.jpg' }
  ];

  searchItems(query: string): Observable<any[]> {
    const searchedItems: any[] = this._items.filter((item) => item.item_name.toLowerCase().search(query.toLowerCase()) !== -1);
    return of(searchedItems);
  }

  formatter = (x) => {
    return x.item_name;
  }

  onSearch(r: any, term: string) {
    console.log(r, ' ', term);
    this.router.navigate(['/item-details', r.item_id]);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      // switchMap(term => {console.log(term); return of([]); }),
      switchMap(term =>
        this.searchItems(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      /*switchMap(term =>
        this._service.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),*/
      tap(() => this.searching = false))

  constructor(private router: Router,private browseItemsService: BrowseItemsService) { }

  ngOnInit() {
    this.browseItemsService.getItems()
      .subscribe(items => this._items = items);
    console.log(this._items);
  }


}
