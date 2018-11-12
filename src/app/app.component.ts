import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from './services/api.service';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nwen304-group-project';
  users: any;

  constructor(private apiService: APIService) {
    apiService.isLoggedIn().subscribe();
  }
}
