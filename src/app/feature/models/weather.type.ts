export type TMain = {
  temp: number;
  temp_min: number;
  temp_max: number;
}

export type TLocation = {
  weather: TWeather;
  main: TMain;
  name: string;
}

export type IForecast = {

}

export type TWeather = [{
  main: string;
}];
