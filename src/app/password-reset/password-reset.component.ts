import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';
import { APIService } from '../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  loading = false;
  success = false;
  token: string;
  error: any;

  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]);
  password_confirm: FormControl = new FormControl('', [Validators.required, CustomValidators.equalTo(this.password)]);

  form: FormGroup = new FormGroup({
    password: this.password,
    password_confirm: this.password_confirm
  });

  /**
   * Custom error messages as CustomValidators does not have default messages.
   */
  customErrorMessages: ErrorMessage[] = [
    {
      error: 'equalTo',
      format: (label, error) => `The password is mismatched with the one above.`
    }
  ];

  constructor(private route: Router, private activatedRoute: ActivatedRoute, private apiService: APIService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((value) => {
      if (value.token) {
        this.token = value.token;
      } else {
        this.route.navigate(['/']);
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
    this.success = false;
    this.error = undefined;

    // Do not continue if the form is not valid.
    if (!this.form.valid) {
      return;
    }

    // Connect to server and reset password
    this.loading = true; // display Loader Screen
    const body: any = { token: this.token, password: this.form.value.password };
    this.apiService.passwordReset(body).subscribe((result) => {
      console.log(result);
      this.loading = false;
      this.success = true;
      setTimeout(() => { this.route.navigate(['/login']); }, 6000);
    }, (error) => {
      console.error(error);
      this.loading = false;
      this.error = error;
    });
  }
}
