import { Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[];

  loading: boolean;

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getAllUsersInformation().pipe(
      map((result: any[]) => result.sort((a, b) => a.user_id - b.user_id))
    ).subscribe((result: any[]) => {
      this.users = result;
      this.loading = false;
    });
  }

}
