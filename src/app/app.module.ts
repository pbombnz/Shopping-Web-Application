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

import {BrowseItemsService} from './browse-items/browse-items.service'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import { HeaderComponent } from './header/header.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { BrowseItemsComponent } from './browse-items/browse-items.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ItemDetailsComponent,
    HeaderComponent,
    CartPageComponent,
    BrowseItemsComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId : 'nwen304-group-project'}),
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordStrengthBarModule,
    NgbModule.forRoot(),
    NgBootstrapFormValidationModule.forRoot(),
    NgBootstrapFormValidationModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'item-details/:id', component: ItemDetailsComponent },
      { path: 'browse', component: BrowseItemsComponent },
      { path: 'cart-page', component: CartPageComponent }
    ])
  ],
  providers: [BrowseItemsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
