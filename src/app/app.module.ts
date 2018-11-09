import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxLoadingModule } from 'ngx-loading';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

import {BrowseItemsService} from './browse-items/browse-items.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { HeaderComponent } from './header/header.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { BrowseItemsComponent } from './browse-items/browse-items.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { APIService } from './services/api.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { AdminModule } from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ItemDetailsComponent,
    HeaderComponent,
    CartPageComponent,
    BrowseItemsComponent,
    SearchBarComponent,
    ForgotPasswordComponent,
    PasswordResetComponent,
    UpdateUserDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId : 'nwen304-group-project'}),
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordStrengthBarModule,
    NgbModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    NgxLoadingModule.forRoot({}),
    AdminModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'item-details/:id', component: ItemDetailsComponent },
      { path: 'browse', component: BrowseItemsComponent },
      { path: 'cart-page', component: CartPageComponent },
      { path: 'update-user-details', component: UpdateUserDetailsComponent }
    ])
  ],
  providers: [ APIService, BrowseItemsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
