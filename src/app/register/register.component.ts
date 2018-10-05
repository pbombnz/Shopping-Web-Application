import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  error = false;

  /**
   * Custom error messages as CustomValidators does not have default messages.
   */
  customErrorMessages: ErrorMessage[] = [
    {
      error: 'equalTo',
      format: (label, error) => `The password is mismatched with the one above.`
    }, {
      error: 'digits',
      format: (label, error) => `${label} Only accepts numbers.`
    }, {
      error: 'rangeLength',
      format: (label, error) => {
        if (error.value[0] === error.value[1]) {
          return `Must be a ${error.value[0]}-digit number.`;
        } else {
          return `Must be a ${error.value[0]}-${error.value[1]} digit number.`;
        }
      }
    },
    {
      error: 'creditCard',
      format: (label, error) => `Must enter valid credit card number.`
    }
  ];

  // Creating Register Form
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]);
  password_confirm: FormControl = new FormControl('', [Validators.required, CustomValidators.equalTo(this.password)]);

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    homePhoneNumber: new FormControl('', Validators.required),
    mobilePhoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: this.password,
    password_confirm: this.password_confirm,
    address_line1: new FormControl('', Validators.required),
    address_line2: new FormControl(),
    address_suburb: new FormControl('', Validators.required),
    address_city: new FormControl('', Validators.required),
    address_postCode: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([4, 4])]),
    card_number: new FormControl('', [Validators.required, CustomValidators.creditCard]),
    card_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    card_cvv: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([3, 3])]),
    card_expiry: new FormControl('',  [Validators.required,  Validators.pattern('^[0-9]{2}\/[0-9]{4}$')]),
  });


  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  clearAllFields() {
    this.error = false;
    this.loading = false;
    this.form.reset();
  }

  onSubmit() {
    console.log(this.form.valid);
    console.log(this.form);
    console.log(this.form.value);

    this.error = false;
    this.loading = false;

    if (!this.form.valid) {
      this.error = true;
      return;
    }


    this.loading = true;
    this.http.get('https://httpbin.org/get').subscribe((res) => {
      console.log(res);
      this.loading = false;
    });
  }
}
