import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  pluck,
  retry,
} from "rxjs";

import { untilDestroyed } from "@ngneat/until-destroy";
import { HttpRequestService } from "src/app/core/http/http-request.service";
import { Logger } from "src/app/core/logger.service";
import { environment } from "src/environments/environment";
import {
  TForecast,
  TLocation,
  TMain,
  TWeather,
  TWeatherMain,
} from "../models/weather.type";
import { v4 as uuid } from "uuid";
import { FeatureConstants } from "../utils";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private http: HttpRequestService, private logger: Logger) {}

  public forecastSubject: BehaviorSubject<TForecast[]> = new BehaviorSubject<
    TForecast[]
  >([]);
  public forecastData$: Observable<TForecast[]> | undefined =
    this.forecastSubject.asObservable();

  getWeatherData = (location: string): Observable<TLocation> => {
    this.logger.debug("-------- getWeatherData ----------");
    this.logger.debug("url", environment.herokuLocationApiUrl + location);
    return this.http.get(environment.herokuLocationApiUrl + location).pipe(
      retry(3),
      map((result) => this.mapGetWeatherData(result as TLocation))
    );
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
    let imageData: string = "";
    const season = data.toUpperCase();

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
    const tWeatherData = {
      main: imageData,
    };
    return tWeatherData;
  };

  getForecast = (zipCode: string) => {
    this.logger.debug(":: getForecast ::");
    const forecastUrl = `${environment.openWeatherApiUrl}forecast?zip=${zipCode},us&appid=${environment.openWeatherId}`;

    this.http
      .get(forecastUrl)
      .pipe(
        retry(1),
        pluck("list"),
        untilDestroyed(this),
        catchError(this.getForecastError),
        map((result) => this.mapForeCast(result))
      )
      .subscribe();
  };

  getForecastError = () => of(0);

  mapForeCast = (result: any) => {
    this.logger.debug("---------------------------------------");
    this.logger.debug(":: mapForeCast ::");
    this.logger.debug("Actual Response", result);
    if (result == 0) {
      this.forecastSubject.next([]);
      return;
    }
    const next5DaysTimeStamp = [
      ...new Set(
        result.map((r: { dt_txt: string }) => r.dt_txt.substring(0, 10))
      ),
    ].splice(0);
    let formatForeCastResponse: Array<TForecast> = [];
    for (let record of next5DaysTimeStamp) {
      const eachDayData = result.find(
        (d: { dt_txt: string }) => d.dt_txt.substring(0, 10) === record
      );
      formatForeCastResponse.push({
        dateTime: eachDayData.dt_txt,
        weather: this.filterForecast(eachDayData.main, eachDayData.weather[0]),
      });
    }
    this.logger.debug("Formatted Response", formatForeCastResponse);
    this.logger.debug("---------------------------------------");
    this.forecastSubject.next(formatForeCastResponse);
  };

  filterForecast = (
    mainWeather: TMain,
    weatherData: TWeather
  ): TWeatherMain => {
    const { temp, temp_min, temp_max }: TMain = mainWeather;
    const { main } = weatherData;
    return { temp, temp_min, temp_max, main };
  };

  convertKtoC = (temp: number): string => {
    return ((temp - 273.15) * 1.8 + 32).toFixed(2);
  };
}
