import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor() { }


  convertKToF = (temp: number): number => {
    return (temp - 273.15) * 1.8 + 32;
  };
}
