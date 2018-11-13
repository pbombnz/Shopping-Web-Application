import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Item } from './browse-items';
// import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BrowseItemsService {
  itemsUrl = 'api/items';  // URL to web api
//   private handleError: HandleError;

  constructor(
    private http: HttpClient
    // httpErrorHandler: HttpErrorHandler) {
    ) {
    // this.handleError = httpErrorHandler.createHandleError('BrowseItemsService');
  }

  /** GET items from the server */
  getItems (): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsUrl)
      .pipe(
        // catchError(this.handleError('getHeroes', []))
      );
  }

  getItemByID(id): Observable<Item> {
    return this.http.get<Item>(this.itemsUrl + '/' + id)
      .pipe(
        // catchError(this.handleError('getHeroes', []))
      );
  }

  // this function requires user authentication to be checked beforehand
  addItemToCart(itemID, quantity): Observable<Object> {
    const url = '/api/addtocart';
    const body = {id: itemID, quantity: quantity};
    console.log('Called post on %s', url);
    return this.http.post<Object>(url, body).pipe();


  }

  private userHasActiveCart(): boolean {
    // check if user has cart with order status of active (but no dispatched)
    return false;
  }



//   /* GET heroes whose name contains search term */
//   searchHeroes(term: string): Observable<Item[]> {
//     term = term.trim();

//     // Add safe, URL encoded search parameter if there is a search term
//     const options = term ?
//      { params: new HttpParams().set('name', term) } : {};

//     return this.http.get<Item[]>(this.itemsUrl, options)
//       .pipe(
//         // catchError(this.handleError<Item[]>('searchHeroes', []))
//       );
//   }

//   //////// Save methods //////////

//   /** POST: add a new item to the database */
//   addHero (item: Item): Observable<Item> {
//     return this.http.post<Item>(this.itemsUrl, item, httpOptions)
//       .pipe(
//         // catchError(this.handleError('addHero', item))
//       );
//   }

//   /** DELETE: delete the item from the server */
//   deleteHero (id: number): Observable<{}> {
//     const url = `${this.itemsUrl}/${id}`; // DELETE api/heroes/42
//     return this.http.delete(url, httpOptions)
//       .pipe(
//         // catchError(this.handleError('deleteHero'))
//       );
//   }

//   /** PUT: update the item on the server. Returns the updated item upon success. */
//   updateHero (item: Item): Observable<Item> {
//     httpOptions.headers =
//       httpOptions.headers.set('Authorization', 'my-new-auth-token');

//     return this.http.put<Item>(this.itemsUrl, item, httpOptions)
//       .pipe(
//         // catchError(this.handleError('updateHero', item))
//       );
//   }
}
