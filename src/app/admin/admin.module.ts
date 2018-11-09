import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ManageUserComponent, NgbdModalContent } from './manage-user/manage-user.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
  ],
  declarations: [ManageUserComponent, AdminComponent, AdminDashboardComponent, NgbdModalContent],
  entryComponents: [NgbdModalContent],
})
export class AdminModule { }
