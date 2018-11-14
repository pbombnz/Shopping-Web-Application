import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { APIService } from '../services/api.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Limited Produce Ltd.';
  isCollapsed = true;

  constructor(private router: Router, public apiService: APIService, public weatherService: WeatherService) { }

  ngOnInit() {
  }

  onLogoutClick() {
    this.apiService.logout().subscribe((result) => {
      this.router.navigate(['/']);
    });
  }
}
