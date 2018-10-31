import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CustomValidators } from 'ngx-custom-validators';
import {ErrorMessage} from 'ng-bootstrap-form-validation';

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

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
  }
}
