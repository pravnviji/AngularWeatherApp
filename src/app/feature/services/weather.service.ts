import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpRequestService } from 'src/app/core/http/http-request.service';
import { Logger } from 'src/app/core/logger.service';
import { environment } from 'src/environments/environment';
import { TLocation } from '../models/weather.type';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpRequestService, private logger: Logger) { }

  getWeatherData = (location: string): Observable<TLocation> => {
    this.logger.debug('-------- getWeatherData ----------');
    return this.http
      .get(environment.herokuLocationApiUrl + location)
      .pipe(map((result) => this.mapGetWeatherData(result as TLocation)));
  }

  mapGetWeatherData = (result: any): TLocation => {
    this.logger.debug(':: mapGetWeatherData ::');
    this.logger.debug('Actual Response', result);
    const formattedResponse = <TLocation>{
      weather: result.weather[0].main,
      main: result.main,
      name: result.name,
    };
    this.logger.debug('Formatted Response', formattedResponse);
    console.log("---------------------------------------");
    return formattedResponse;
  }

  convertKToF = (temp: number): number => {
    return (temp - 273.15) * 1.8 + 32;
  };
}
