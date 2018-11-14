import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { APIService } from './api.service';

enum Weather {
    THUNDER = 'Thunderstorm',
    DRIZZLE = 'Drizzle',
    RAIN =  'Rain',
    SNOW = 'Snow',
    AMBIENCE = 'Atmosphere',
    CLEAR = 'Clear',
    CLOUD = 'Clouds',
    DEFAULT = 'Unknown'
}

/**
 * This classes utilises OpenWeatherMap's Weather API to get weather data
 * as part of the external service requirement for recommendations.
 */
@Injectable({
    providedIn: 'root'
  })
export class WeatherService {

    // api key
    private appId: string;
    // private appCode: string;

    // where the data is based
    private city: string;
    private country: string;
    private units: string;
    private externalURL: string;

    // weather data
    public weatherData: any;
    public weatherCondition: string;


    public constructor(private http: HttpClient, private apiService: APIService) {

    }

    // promise the weather condition
    public getWeatherCondition() {
        return this.getUserAddressCity().then( ()=>{
            return this.requestWeatherData().then( (result) => {
                return this.assessWeatherCondition(result);
            })
        });
    }

    // get data from external service: openweathermap
    private requestWeatherData = function() {
        return new Promise((resolve, reject) => {
            this.http.get(this.externalURL).subscribe(res => {
                this.weatherData = res;
                resolve(res);
            });
        });
    };

    // Weather Condition Codes: https://openweathermap.org/weather-conditions
    private assessWeatherCondition = function(weatherData) {
        return new Promise((resolve, reject) => {
            const weatherID = weatherData.weather[0].id;
            console.log(weatherID);

            // if not a valid weather from the API docs (Which shouldn't happen)
            if (weatherID < 200 || weatherID >= 900) { this.weatherCondition = Weather.DEFAULT; }

            if (weatherID >= 200 && weatherID < 300) { this.weatherCondition = Weather.THUNDER; }
            if (weatherID >= 300 && weatherID < 400) { this.weatherCondition = Weather.DRIZZLE; }
            if (weatherID >= 500 && weatherID < 600) { this.weatherCondition = Weather.RAIN; }
            if (weatherID >= 600 && weatherID < 700) { this.weatherCondition = Weather.SNOW; }
            if (weatherID >= 700 && weatherID < 800) { this.weatherCondition = Weather.AMBIENCE; }
            if (weatherID === 800) { this.weatherCondition = Weather.CLEAR; }
            if (weatherID > 800 && weatherID < 900) { this.weatherCondition = Weather.CLOUD; }

            resolve(this.weatherCondition);
        });
    };

    private getUserAddressCity = function(){
        return new Promise((resolve, reject) =>{
            this.apiService.getUserInformation().subscribe((result) =>{
                console.log(result);
    
                // APP Key from my account
                this.appId = 'd5fe3061eb1bc6a1d724d33ae9417b92';
                this.weatherData = [];
                // this.city = 'Wellington';
                this.city = <string> result.address_city;
                this.country = 'nz';
                this.units = '&units=metric';
                this.externalURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + this.city + ',' + this.country + this.units + '&APPID=' + this.appId;

                resolve();
            });
        });
    }

}
