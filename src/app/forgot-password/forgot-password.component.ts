import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'ngx-custom-validators';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { APIService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  loading = false;
  success = false;
  error: any;

  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, CustomValidators.email])
  });

  constructor(private router: Router, private apiService: APIService) {}

  ngOnInit() {}

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

    // Connect to server and register
    this.loading = true; // display Loader Screen
    this.apiService.forgotPassword(this.form.value).subscribe((result) => {
      console.log(result);
      setTimeout(() => { this.router.navigate(['/']); }, 10000);
      this.loading = false;
      this.success = true;
    }, (error) => {
      this.loading = false;
      this.error = error;
    });
  }
}
