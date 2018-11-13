import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../admin/manage-user/manage-user.component';

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {
  user: any;
  loading = false;

  successMessage: string = null;
  dangerMessage: string = null;

  constructor(public apiService: APIService, private activatedRoute: ActivatedRoute,
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
      this.user = result;
      this.loading = false;
    });
  }

  viewOrder(order: any) {
    this.loading = true;
    this.apiService.getUserOrderItems(this.user.user_id, order.order_id).subscribe(result => {
      const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg'});
      modalRef.componentInstance.orderItems = result;
      this.loading = false;
    }, (error: any) => {
      this.dangerMessage = 'Can not retrieve Order invoice at this given time. Please try again later.';
      setTimeout(() => this.dangerMessage = null, 7000);
    });
  }
}
