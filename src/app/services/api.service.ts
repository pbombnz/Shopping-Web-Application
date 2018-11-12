import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private user: any = undefined;
  private sessionExpires: moment.Moment = null;

  constructor(private http: HttpClient) {
    // Determines if we are still logged in or not. On first load of the website,
    // this will be false, but if the user was previously logged in and had an
    // active session, this gets the basic information for angular to know that we
    // are still logged in.
    // this.isLoggedIn().subscribe();
  }

  getUserFirstName(): string {
    return this.user ? this.user.first_name : null;
  }

  getUserLastName(): string {
    return this.user ? this.user.last_name : null;
  }

  getUserEmail(): string {
    return this.user ? this.user.email : null;
  }

  getSessionExpires(): moment.Moment {
    return this.user ? this.sessionExpires : null;
  }

  isUserAdmin(): boolean {
    return this.user ? this.user.admin : false;
  }

  isAuthenticated(): boolean {
    return this.user ? true : false;
  }

  /**
   * Register a new user. Certain attributes have server-side/database-level validation. If they
   * fail, an error is given in the response with details explaining the where the error occured.
   *
   * @param body The information required to register a new user. Password is given in plaintext.
   */
  register(body: {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    address_line1: string,
    address_line2: string,
    address_suburb: string,
    address_city: string,
    address_postcode: number
    phone: string,
  }): Observable<Object> {
    return this.http.post('/auth/local/register', body);
  }

  /**
   * Register a new user that has already been authenticated with Google but has missing attributes
   * that need to be filled in. Certain attributes have server-side/database-level validation. If they
   * fail, an error is given in the response with details explaining the where the error occured.
   *
   * @param body The information required to register a new user. Password is given in plaintext.
   */
  registerWithGoogle(body: {
    address_line1: string,
    address_line2: string,
    address_suburb: string,
    address_city: string,
    address_postcode: number
    phone: string,
  }): Observable<Object> {
    return this.http.put('/auth/google/register', body);
  }

  loginWithGoogle(): Observable<Object> {
    throw new Error('To access Google Authentication, create a button on a page link it to' +
    '/auth/google. For example, "<a href="/auth/google">Sign in with Google</a>".');
  }

  login(body: { email: string, password: string}): Observable<Object> {
    return this.http.post('/auth/local', body).pipe(
      tap((result: any) => {
        this.user = result.user;
        this.sessionExpires = moment.utc(result._expires).local();

        // console.log(result._expires);
        // console.log(this.sessionExpires.format());
      })
    );
  }

  logout(force: boolean = false): Observable<Object> {
    if (force) {
      this.user = undefined;
      this.sessionExpires = null;
    }

    return this.http.get('/auth/logout').pipe(
      tap(() => {
        this.user = undefined;
        this.sessionExpires = null;
      }),
      catchError(() => of({ message: 'Logout successful.' }))
    );
  }

  isLoggedIn(): Observable<boolean> {
    if (this.sessionExpires && this.user) {
      if (moment().isBefore(this.sessionExpires)) {
        return of(true);
      }
    }

    return this.http.get('/auth/loggedin').pipe(
      tap((result: any) => {
        this.user = result.authenticated ? result.user : undefined;
        this.sessionExpires = result._expires ? moment.utc(result._expires).local() : null;

        console.log(result._expires);
        console.log(this.sessionExpires ? this.sessionExpires.format() : null);
      }),
      map((result: any) => result.authenticated),
    );
  }

  forgotPassword(body: { email: string}): Observable<Object> {
    return this.http.put('/auth/forgot-password', body).pipe(
      tap((result: any) => console.log(result))
    );
  }

  passwordReset(body: { token: string, password: string}): Observable<Object> {
    return this.http.put('/auth/password-reset', body).pipe(
      tap((result: any) => console.log(result))
    );
  }

  getUserInformation(id?: number): Observable<Object> {
    const url = `/api/users${(id ? `/${id}` : '')}`;

    return this.http.get(url).pipe(
      tap((result: any) => console.log(result))
    );
  }

  updateUserInformation(id: number, body: any): Observable<Object> {
    const url = `/api/users${(id ? `/${id}` : '')}`;

    return this.http.put(url, body).pipe(
      tap((result: any) => console.log(result))
    );
  }

  /* Order Routes */
  getUserOrderHistory(id: number): Observable<Object> {
    return forkJoin([
      this.http.get(`/api/users/${id}/orders/delivered`),
      this.http.get(`/api/users/${id}/orders/dispatched`)
    ]).pipe(
      map((result: any[]) => ({delivered: result[0], dispatched: result[1], })),
    );
  }

  getOrderStatusString(num: number): string {
    switch (num) {
      case 0:
        return 'Shopping Cart';
      case 1:
        return 'Dispatched';
      case 2:
        return 'Delivered';
      default:
        return num.toString();
    }
  }

  getUserOrderItems(userId: number, orderId: number): Observable<Object> {
    return this.http.get(`/api/users/${userId}/orders/${orderId}`).pipe(
      map((value: any[]) => {
        return value.map((item: any, index: number) => {
          item.item_price = +((item.item_price as string).substr(1));
          return item;
        });
      })
    );
  }

  /* Strictly Admin Routes */
  getAllUsersInformation(): Observable<Object> {
    return this.http.get(`/api/users/all`);
  }

  setUserOrderArchive(userId: number, orderId: number, archive: boolean): Observable<Object> {
    return this.http.put(`/api/users/${userId}/orders/${orderId}`, { archive });
  }
}
