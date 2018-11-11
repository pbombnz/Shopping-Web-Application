import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Dictionary } from 'typescript-collections';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  constructor(private WeatherService: WeatherService) { }

  recommendationsStrings = new Dictionary<String, String>();

  recommendation: String;

  ngOnInit() {
    // Initialise recommendations
    this.recommendationsStrings.setValue("Thunderstorm", "Have some grapes while watching the light show");
    this.recommendationsStrings.setValue("Snow","Have some beef for stew on this cold day");
    this.recommendationsStrings.setValue("Rain", "Have some beetroot and chicken, it's raining");
    this.recommendationsStrings.setValue("Atmosphere", "Grab some avocado for this atmospheric day");
    this.recommendationsStrings.setValue("Clouds", "Have some oranges for this cloudy day, it's good to have vitamen D");
    this.recommendationsStrings.setValue("Clear", "It's sunny! Buy meat and veges for a BBQ!");
    this.recommendationsStrings.setValue("Unknown", "We cannot recommend anything, we have no weather data");
    this.recommendationsStrings.setValue("Drizzle", "Have some ... for this drizzling day");

    // update recommendation once promise for weather data han been resolved
    this.WeatherService.getWeatherCondition().then((result) =>{
      let key = <string> result;

      this.recommendation = this.recommendationsStrings.getValue(key);
    });

  }

}
