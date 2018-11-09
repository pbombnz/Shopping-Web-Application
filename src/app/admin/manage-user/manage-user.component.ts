import { Component, OnInit, Input } from '@angular/core';
import { APIService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap, map, tap } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ngbd-modal-content',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">Order Invoice</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
      <table class="table table-bordered">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quatity</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody *ngIf="orderItems?.length === 0">
            <tr>
              <td class="text-center" colspan="6">
                No Items for this order.
              </td>
            </tr>
          </tbody>
          <tbody *ngIf="orderItems?.length > 0">
            <tr *ngFor="let item of orderItems">
              <td>{{item.item_id}}</td>
              <td>
                <img src="{{item.item_image}}" class="img-thumbnail" style="height:100px;" />
              </td>
              <td>{{item.item_name}}</td>
              <td class="text-right">{{item.item_price | currency: 'NZD'}}</td>
              <td class="text-right">
                {{item.quantity}}
              </td>
              <td class="text-right">
              {{(item.quantity * item.item_price) | currency: 'NZD'}}
             </td>
            </tr>
          </tbody>
          <tfoot *ngIf="orderItems?.length > 0">
            <tr>
              <th>Total Price</th>
              <td colspan="6" class="text-right">{{total | currency: 'NZD' }}</td>
            </tr>
          </tfoot>
        </table>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Okay button click')">Okay</button>
  </div>
  `
})
export class NgbdModalContent {
  private _orderItems: any;
  total: number;

  constructor(public activeModal: NgbActiveModal) {}

  get orderItems(): any {
    return this._orderItems;
  }

  @Input()
  set orderItems(orderItems: any) {
    console.log(orderItems);
    this._orderItems = orderItems;

    this.total = 0.0;
    for (let i = 0; i < this._orderItems.length; i++) {
      console.log(this._orderItems[i]);
      this.total += (this._orderItems[i].item_price * this._orderItems[i].quantity);
    }

  }
}


@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  user: any;

  loading: boolean;

  successMessage: string = null;
  dangerMessage: string = null;

  constructor(public apiService: APIService, private route: Router, private activatedRoute: ActivatedRoute,
     private modalService: NgbModal) { }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.pipe(
      mergeMap((params: any) => this.apiService.getUserInformation(params.id)),
      mergeMap((userInformationResult: any) => this.apiService.getUserOrderHistory(userInformationResult.user_id).pipe(
        map((orderHistoryResult: any) => {
          userInformationResult.orderHistory = orderHistoryResult;
          return userInformationResult;
        })
      ))
    ).subscribe((result: any) => {
      console.log(result);
      this.user = result;
      this.loading = false;
    });
  }

  toggleAdminPrivileges() {
    const body = { admin: !this.user.admin };
    this.apiService.updateUserInformation(this.user.user_id, body).subscribe(
      (result) => {
        this.user.admin = !this.user.admin;
        this.successMessage = 'Updated User Admin Privileges.';
        setTimeout(() => this.successMessage = null, 6000);
      },
      (err) => {
        this.dangerMessage = 'Failed to Update User Admin Privileges.';
        setTimeout(() => this.dangerMessage = null, 6000);
      }
    );
  }

  toggleOrderArchive(order: any) {
    console.log('yes!');

    this.apiService.setUserOrderArchive(this.user.user_id, order.order_id, !order.archive).subscribe(
      result => {
        order.archive = !order.archive;
        const archiveStr =  order.archive ?
        'Successfully archived order. User can no longer see order.' :
        'Successfully restored order. User can see this order in their history now.';
        this.successMessage = archiveStr;
        setTimeout(() => this.successMessage = null, 7000);
      }, error => {
        this.dangerMessage = 'Can not toggle the archive status of this order. Please try again later.';
        setTimeout(() => this.dangerMessage = null, 7000);
      }
    )
  }


  viewOrder(order: any) {
    this.loading = true;
    this.apiService.getUserOrderItems(this.user.user_id, order.order_id).subscribe(result => {
      // console.log('view order: ', result);
      const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg'});
      modalRef.componentInstance.orderItems = result;
      this.loading = false;
    }, (error: any) => {
      this.dangerMessage = 'Can not retrieve Order invoice at this given time. Please try again later.';
      setTimeout(() => this.dangerMessage = null, 7000);
    });
  }
}
