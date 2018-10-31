import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';
import { APIService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  error: any;

  googleAuth = false;

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

  // Creating Register Form (Normal Users)
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]);
  password_confirm: FormControl = new FormControl('', [Validators.required, CustomValidators.equalTo(this.password)]);

  form: FormGroup = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    /*homePhoneNumber*/phone : new FormControl('', Validators.required),
    // mobilePhoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: this.password,
    password_confirm: this.password_confirm,
    address_line1: new FormControl('', Validators.required),
    address_line2: new FormControl(''),
    address_suburb: new FormControl('', Validators.required),
    address_city: new FormControl('', Validators.required),
    address_postcode: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([4, 4])]),
    // card_number: new FormControl('', [Validators.required, CustomValidators.creditCard]),
    // card_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    // card_cvv: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([3, 3])]),
    // card_expiry: new FormControl('',  [Validators.required,  Validators.pattern('^[0-9]{2}\/[0-9]{4}$')]),
  });


  constructor(private router: Router, private activeRoute: ActivatedRoute, private http: HttpClient, private apiService: APIService) {
   }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      if (!params.googleAuth) {
        return;
      }

      this.googleAuth = (params.googleAuth === 'true');
      if (this.googleAuth) {
        this.form = new FormGroup({
          phone : new FormControl('', Validators.required),
          address_line1: new FormControl('', Validators.required),
          address_line2: new FormControl(''),
          address_suburb: new FormControl('', Validators.required),
          address_city: new FormControl('', Validators.required),
          address_postcode: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([4, 4])]),
        });
      }
    });
  }

  clearAllFields() {
    this.error = undefined;
    this.loading = false;
    this.form.reset();
  }

  convertFormToBodyObject(): any {
    const formValues: any = Object.assign({}, this.form.value);
    delete formValues.password_confirm;
    console.log(formValues);
    return formValues;
  }

  onSubmit() {
    // Debug
    console.log(this.form.valid);
    console.log(this.form);
    console.log(this.form.value);

    // Reset Page Status
    this.error = undefined;
    this.loading = false;

    // Do not continue if the form is not valid.
    if (!this.form.valid) {
      return;
    }

    // Connect to server and register
    this.loading = true; // display Loader Screen

    let registerObservable;
    if (this.googleAuth) {
      registerObservable = this.apiService.registerWithGoogle(this.convertFormToBodyObject());
    } else {
      registerObservable = this.apiService.register(this.convertFormToBodyObject());
    }

    registerObservable.subscribe((result) => {
      console.log('WE IN BROTHER');
      console.log(result);
      if (this.googleAuth) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/login']);
      }
      this.loading = false;
    }, (error) => {
      console.log(error);
      this.loading = false;
      this.error = error;
    });
  }
}
