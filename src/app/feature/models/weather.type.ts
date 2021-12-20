export type TMain = {
  temp: number;
  temp_min: number;
  temp_max: number;
};

export type TLocation = {
  id: string;
  weather: TWeather;
  main: TMain;
  name: string;
};

export type TWeather = {
  main: string;
};

export type TWeatherMain = TWeather & TMain;

export type TForecast = {
  dateTime: string;
  weather: TWeatherMain;
};
