import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nwen304-group-project';
  users: any;

  constructor(http: HttpClient, private weatherService: WeatherService) {
    // get external data on load
    // this.weatherService.getWeatherData();

    http.get('/api/users').subscribe((res) => {
      console.log(res);
      this.users = res;
    });
  }
}
