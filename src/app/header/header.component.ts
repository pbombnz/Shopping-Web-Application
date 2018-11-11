import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { APIService } from '../services/api.service';
import { WeatherService } from '../services/weather.service';
import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'Supermarket Shopping Site';
  isCollapsed = true;

  constructor(private router: Router, public apiService: APIService, public weatherService: WeatherService) { }

  ngOnInit() {
    // === TEST can be removed === //
    console.log("get weather api");
    this.weatherService.getWeather();
    // ========================== //
  }

  onLoginButtonClicked() {
    this.router.navigate(['/login']);
  }

  onCartButtonClicked(){
    // === TEST can be removed === //
    console.log(this.weatherService.weatherCondition);
    // ========================== //

    this.router.navigate(['/cart-page']);
    
  }

  onUpdateUserDetailsButtonClicked() {}

  onMyOrdersButtonClicked() {}

  onLogoutButtonClicked() {
    this.apiService.logout().subscribe((result) => {
      this.router.navigate(['/']);
    });
  }
}
