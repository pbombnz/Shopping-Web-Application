import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  warningMessage: string;
  dangerMessage: string;
  fail_login = false;

  redirectUrl: string;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    rememberPassword: new FormControl(false)
  });

  constructor(private apiService: APIService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(queryParams => {
      if (queryParams.redirect) {
        this.redirectUrl = queryParams.redirect;
      }
    });
  }

  onSubmit() {
    // Debug
    console.log(this.form.valid);
    console.log(this.form);
    console.log(this.form.value);

    // Reset Page Status
    this.loading = false;
    this.dangerMessage = undefined;
    this.fail_login = false;

    // Do not continue if the form is not valid.
    if (!this.form.valid) {
      return;
    }

    // Connect to server and register
    this.loading = true; // display Loader Screen
    this.apiService.login(this.form.value).subscribe((result) => {
      console.log(result);
      this.router.navigate([this.redirectUrl || '/']).catch((reason: any) => {
        // Cannot navigate because redirect url is NOT relative.
        this.router.navigate(['/']);
      });
      this.loading = false;
    }, (error) => {
      this.loading = false;
      if (error.status === 401) { // Unauthorized - Failed Login
        this.fail_login = true;
        // Hide error after 10 seconds.
        setTimeout(() => { this.fail_login = false; } , 10000);
      } else {
        this.dangerMessage = 'Cannot login due to network issues. Please try again later.';
        // Hide error after 5 seconds.
        setTimeout(() => { this.dangerMessage = undefined; } , 8000);
      }
    });
  }

}
