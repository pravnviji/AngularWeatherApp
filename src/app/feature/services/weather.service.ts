import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpRequestService } from "src/app/core/http/http-request.service";
import { Logger } from "src/app/core/logger.service";
import { environment } from "src/environments/environment";
import { TLocation, TWeather } from "../models/weather.type";
import { v4 as uuid } from "uuid";
import { FeatureConstants } from "../utils";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private http: HttpRequestService, private logger: Logger) {}

  getWeatherData = (location: string): Observable<TLocation> => {
    this.logger.debug("-------- getWeatherData ----------");
    return this.http
      .get(environment.herokuLocationApiUrl + location)
      .pipe(map((result) => this.mapGetWeatherData(result as TLocation)));
  };

  mapGetWeatherData = (result: any): TLocation => {
    this.logger.debug(":: mapGetWeatherData ::");
    this.logger.debug("Actual Response", result);
    const formattedResponse = <TLocation>{
      id: uuid(),
      weather: this.filterWeatherIcon(result.weather[0].main),
      main: result.main,
      name: result.name,
    };
    this.logger.debug("Formatted Response", formattedResponse);
    console.log("---------------------------------------");
    return formattedResponse;
  };

  filterWeatherIcon = (data: string): TWeather => {
    this.logger.debug("filterWeatherIcon");
    let imageData: string = "";
    const season = data.toUpperCase();
    this.logger.debug("Seasson", season);

    switch (season) {
      case "RAIN":
        imageData = FeatureConstants.WEATHER_IMAGE[0].RAIN;
        break;
      case "CLOUDS":
        imageData = FeatureConstants.WEATHER_IMAGE[0].CLOUDS;
        break;
      case "SNOW":
        imageData = FeatureConstants.WEATHER_IMAGE[0].SNOW;
        break;
      default:
        imageData = FeatureConstants.WEATHER_IMAGE[0].CLEAR;
        break;
    }
    this.logger.debug("imageData", season);
    const tWeatherData = {
      main: imageData,
    };
    return tWeatherData;
  };
}
