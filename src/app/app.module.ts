import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { SessionExpireInterceptor } from './interceptors/session-expire-interceptor';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthRequiredGuard } from './guards/auth-required.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

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
    UpdateUserDetailsComponent,
    PageNotFoundComponent
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
      { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NoAuthGuard] },
      { path: 'password-reset', component: PasswordResetComponent, canActivate: [NoAuthGuard] },
      { path: 'item-details/:id', component: ItemDetailsComponent },
      { path: 'browse', component: BrowseItemsComponent },
      { path: 'cart-page', component: CartPageComponent },
      { path: 'update-user-details', component: UpdateUserDetailsComponent, canActivate: [AuthRequiredGuard] },
      // Other routes...
      { path: '**',  component: PageNotFoundComponent },
    ])
  ],
  providers: [ APIService, BrowseItemsService, { provide: HTTP_INTERCEPTORS, useClass: SessionExpireInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
