import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  password: FormControl = new FormControl('', Validators.required);
  password_confirm: FormControl = new FormControl('', CustomValidators.equalTo(this.password));

  form: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    homePhoneNumber: new FormControl('', Validators.required),
    mobilePhoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', CustomValidators.email),
    password: this.password,
    password_confirm: this.password_confirm,
    address_line1: new FormControl('', Validators.required),
    address_line2: new FormControl(),
    address_suburb: new FormControl('', Validators.required),
    address_city: new FormControl('', Validators.required),
    address_postCode: new FormControl('', [Validators.required, CustomValidators.number, CustomValidators.rangeLength([4, 4])]),
    card_number: new FormControl('', CustomValidators.creditCard),
    card_name: new FormControl('', Validators.pattern('[a-zA-Z ]+')),
    card_cvv: new FormControl('', [Validators.required, CustomValidators.number, CustomValidators.rangeLength([3, 3])]),
    card_expiry: new FormControl('',  Validators.pattern('^[0-9]{2}\/[0-9]{4}$')),
  });


  constructor() { }

  ngOnInit() {
    this.form.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  clearAllFields() {
    this.form.reset();
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
