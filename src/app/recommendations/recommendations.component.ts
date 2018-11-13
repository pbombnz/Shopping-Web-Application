import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { BrowseItemsService } from '../browse-items/browse-items.service';
import { Dictionary } from 'typescript-collections';
import { Item } from '../browse-items/browse-items';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css']
})
export class RecommendationsComponent implements OnInit {

  constructor(private weatherService: WeatherService, private browseItemService: BrowseItemsService, private router: Router) { }

  recommendationsStrings = new Dictionary<String, String>();

  recommendationQueries = new Dictionary<String, String[]>();

  recommendation: String;
  recommendationQuery: String[];

  itemRecommendations: Item[] = [];

  ngOnInit() {
    // Initialise recommendations
    this.recommendationsStrings.setValue('Thunderstorm', 'Have some grapes while watching the light show');
    this.recommendationsStrings.setValue('Snow', 'Have some beef for stew on this cold day');
    this.recommendationsStrings.setValue('Rain', 'Have some beetroot and chicken, it\'s raining');
    this.recommendationsStrings.setValue('Atmosphere', 'Grab some avocado for this atmospheric day');
    this.recommendationsStrings.setValue('Clouds', 'Have some mandarins for this cloudy day, it\'s good to have vitamin D');
    this.recommendationsStrings.setValue('Clear', 'It\'s sunny! Buy meat and veges for a BBQ!');
    this.recommendationsStrings.setValue('Unknown', 'We cannot recommend anything, we have no weather data');
    this.recommendationsStrings.setValue('Drizzle', 'Sweet corn is great for this drizzling day');

    // Initialise queries
    this.recommendationQueries.setValue('Thunderstorm', ['6']);
    this.recommendationQueries.setValue('Snow', ['25', '48', '59']);
    this.recommendationQueries.setValue('Rain', ['29', '45']);
    this.recommendationQueries.setValue('Atmosphere', ['4']);
    this.recommendationQueries.setValue('Clouds', ['9']);
    this.recommendationQueries.setValue('Clear', ['64', '23']);
    this.recommendationQueries.setValue('Unknown', []);
    this.recommendationQueries.setValue('Drizzle', ['64']);

    // update recommendation once promise for weather data han been resolved
    this.weatherService.getWeatherCondition().then((result) => {
      const key = <string> result;

      this.recommendation = this.recommendationsStrings.getValue(key);
      this.recommendationQuery = this.recommendationQueries.getValue(key);

      this.recommendationQuery.forEach( (itemID) => {
        this.browseItemService.getItemByID(itemID).subscribe((item) => {
          this.itemRecommendations.push(item);
        });
      });
    });
  }

  onItemClicked(item: any) {
    this.router.navigate(['/item-details', item.item_id]);
  }
}
