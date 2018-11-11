import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  constructor(private WeatherService: WeatherService) { }

  recommendationsStrings = {
    Thunderstorm: "Have some grapes while watching the light show",
    Snow: "Have some beef for stew on this cold day",
    Drizzle: "Have some ... for this drizzling day",
    Rain: "Have some beetroot and chicken, it's raining",
    Atmosphere: "Grab some avocado for this atmospheric day",
    Cloud: "Have some oranges for this cloudy day, it's good to have vitamen D",
    Clear: "It's sunny! Buy meat and veges for a BBQ!",
    Unknown: "We cannot recommend anything, we have no weather data"
  };

  recommendation = 'placeholder';

  ngOnInit() {
    this.WeatherService.getWeather();
    
    //while(typeof this.WeatherService.weatherCondition === "undefined"){}
    //console.log(this.WeatherService.weatherCondition);

    this.recommendation = "ready";

    //this.recommendation =  this.recommendationsStrings[this.WeatherService.weatherCondition];

  }

}
