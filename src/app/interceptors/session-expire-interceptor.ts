import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs';
import { APIService } from '../services/api.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable()
export class SessionExpireInterceptor implements HttpInterceptor {
    constructor(private apiService: APIService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const nowDate: moment.Moment = moment();
        const expireDate: moment.Moment = this.apiService.getSessionExpires();

        // Check if logged session
        // console.log('request.url: ', request.url);
        // console.log('nowDate:', nowDate.format());
        // console.log('Session expires: ', expireDate ? expireDate.format() : null);
        if (expireDate && this.apiService.isAuthenticated()) {
            // console.log('Logged Session exists');
            // Session already expired
            if (nowDate.isAfter(expireDate)) {
                // console.log('Session is expired. Redirect to login.');
                this.router.navigate(['login'], { queryParams: { redirect: this.router.url}});
                this.apiService.logout(true).subscribe();
                return EMPTY;
            }
        }
        // return EMPTY;
        return next.handle(request);
    }
}
