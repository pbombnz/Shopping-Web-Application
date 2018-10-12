import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error = false;
  loginFailed = false;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(5), Validators.maxLength(50)]),
    rememberPassword: new FormControl(false)
  });

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSubmit() {
    // Debug
    console.log(this.form.valid);
    console.log(this.form);
    console.log(this.form.value);

    // Reset Page Status
    this.error = false;
    this.loading = false;
    this.loginFailed = false;

    // Do not continue if the form is not valid.
    if (!this.form.valid) {
      return;
    }

    // Connect to server and register
    this.loading = true; // display Loader Screen
    this.http.get('https://httpbin.org/get').subscribe((result) => {
      console.log(result);
      this.loading = false;

      // Hard coded failure
      if (this.form.value.email === 'p@b') {
        this.loginFailed = true;
      }
    }, (error) => {
      this.loading = false;
      this.error = true;
    });
  }

}
