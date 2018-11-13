import { Component, OnInit } from '@angular/core';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { CustomValidators } from 'ngx-custom-validators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.css']
})
export class UpdateUserDetailsComponent implements OnInit {
  loading = false;
  success = false;


  /**
   * Custom error messages as CustomValidators does not have default messages.
   */  error: any;

  userAccountInformation: any;
  customErrorMessages: ErrorMessage[] = [
    {
      error: 'equalTo',
      format: (label, error) => `The password is mismatched with the one above.`
    }, {
      error: 'digits',
      format: (label, error) => `${label} Only accepts numbers.`
    }, {
      error: 'rangeLength', format: (label, error) => {
        if (error.value[0] === error.value[1]) {
          return `Must be a ${error.value[0]}-digit number.`;
        } else {
          return `Must be a ${error.value[0]}-${error.value[1]} digit number.`;
        }
      }
    }
  ];

  // Creating Register Form (Normal Users)
  password: FormControl = new FormControl('', [Validators.minLength(5), Validators.maxLength(50)]);
  password_confirm: FormControl = new FormControl('', [CustomValidators.equalTo(this.password)]);

  form: FormGroup = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    phone : new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: this.password,
    password_confirm: this.password_confirm,
    address_line1: new FormControl('', Validators.required),
    address_line2: new FormControl(''),
    address_suburb: new FormControl('', Validators.required),
    address_city: new FormControl('', Validators.required),
    address_postcode: new FormControl('', [Validators.required, CustomValidators.digits, CustomValidators.rangeLength([4, 4])]),
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private apiService: APIService) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getUserInformation().subscribe((result: any) => {
      this.loading = false;

      if (this.apiService.isUserAdmin()) {
        delete result['user_id'];
        delete result['password'];
        delete result['google_id'];
        delete result['password_reset_token'];
        delete result['password_reset_token_expiry'];
        delete result['admin'];
      }

      this.userAccountInformation = Object.assign({ password: '', password_confirm: ''}, result);

      // Need to convert the Address Postcode to string to make Form validation happy.
      this.userAccountInformation.address_postcode = this.userAccountInformation.address_postcode.toString();
      this.form.setValue(this.userAccountInformation);
    }, (error) => {
      console.error();
      this.loading = false;
      this.router.navigate(['/']);
    });
  }

  resetFields() {
    this.error = undefined;
    this.form.setValue(this.userAccountInformation);
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
    this.success = false;
    this.loading = false;

    if (!this.form.valid) {
      return;
    }

    const body = this.convertFormToBodyObject();

    this.loading = true;
    this.apiService.updateUserInformation(undefined, body).subscribe(
      (result) => {
        this.loading = false;
        this.success = true;
        this.form.disable();
        setTimeout(() => this.router.navigate(['/']), 7000);
      },
      (error) => {
        this.loading = false;
        this.error = error;
      }
    );
  }
}
