import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

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
    private units : string;
    private externalURL: string;

    public weatherData: any;
    public weatherCondition: string;

    public constructor(private http: HttpClient) {
        this.appId = "d5fe3061eb1bc6a1d724d33ae9417b92";
        // this.appCode = "APP-CODE-HERE";
        this.weatherData = [];
        this.city = "Wellington";
        this.country = "nz";
        this.units = "&units=metric"
        this.externalURL = "http://api.openweathermap.org/data/2.5/weather?q=" + this.city + ',' + this.country + this.units + '&APPID=' + this.appId;

    }

    public getWeather() {
        this.http.get(this.externalURL).subscribe(res =>{
            console.log(res);
            this.weatherData = res;
            this.assessWeatherCondition();

        })
    }

    private assessWeatherCondition(){
        let weatherID = this.weatherData.weather[0].id

        if(weatherID >= 200 && weatherID < 300){ this.weatherCondition = "Thunderstorm"; }
        if(weatherID >= 300 && weatherID < 400){ this.weatherCondition = "Drizzle"; }
        if(weatherID >= 500 && weatherID < 600){ this.weatherCondition = "Rain"; }
        if(weatherID >= 600 && weatherID < 700){ this.weatherCondition = "Snow"; }
        if(weatherID >= 200 && weatherID < 300){ this.weatherCondition = "Thunderstorm"; }
        if(weatherID >= 200 && weatherID < 300){ this.weatherCondition = "Atmosphere"; }
        if(weatherID >= 200 && weatherID < 300){ this.weatherCondition = "Thunderstorm"; }
        if(weatherID == 800){ this.weatherCondition = "Clear"; }
        if(weatherID > 800 && weatherID < 900){ this.weatherCondition = "Clouds"; }
        
    }

}