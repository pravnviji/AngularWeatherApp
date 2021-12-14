import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "src/app/core/local.storage.service";
import { Logger } from "src/app/core/logger.service";
import { TLocation } from "../../models/weather.type";
import { WeatherService } from "../../services/weather.service";
import { FeatureConstants } from "../../utils";

@Component({
  selector: "ng-search-location",
  templateUrl: "./search-location.component.html",
  styleUrls: ["./search-location.component.scss"],
})
export class SearchLocationComponent implements OnInit {
  @ViewChild("addLocation", { static: true })
  addLocation!: ElementRef;
  zipCodes: Array<string> | undefined;
  isCurrentWeatherEnable: boolean | false | undefined;
  weatherData: Array<TLocation> | undefined;

  constructor(
    private logger: Logger,
    private weatherService: WeatherService,
    private localStorage: LocalStorageService
  ) {
    this.logger.debug(":: SearchLocationComponent ::");
  }

  ngOnInit(): void {
    this.logger.debug(":: SearchLocationComponent OnInit ::");

    const getWeatherData = this.localStorage.get(
      FeatureConstants.ZIP_WEATHER_DATA
    );
    this.setUpdateWeatherData(getWeatherData);
  }

  storeWeatherLocation = () => {
    this.logger.debug(":: storeWeatherLocation ::");
    const zipCode: string = this.addLocation.nativeElement.value;
    this.logger.debug(":: Zipcode ::", zipCode);
    if (!this.checkZipValid(zipCode)) {
      alert("Please enter the valid zipcode");
      return;
    }
    this.weatherService.getWeatherData(zipCode).subscribe((data) => {
      //  this.addNewZipCodes(zipCode);
      this.currentWeatherCondition(data);
      this.clearZipCode();
    });
  };

  addNewZipCodes = (zipCode: string) => {
    this.addDataToStorage(zipCode, FeatureConstants.ZIP_CODES);
  };

  checkZipValid = (zipCode: string): boolean => {
    const regEx = new RegExp("^[0-9]+$");
    return zipCode.length === 5 && regEx.test(zipCode);
  };

  clearZipCode = () => {
    this.addLocation.nativeElement.value = "";
  };

  currentWeatherCondition = (data: TLocation) => {
    this.logger.debug(":: currentWeatherCondition ::");
    this.logger.debug("", data);
    this.addNewWeatherData(data);
  };

  addNewWeatherData = (data: TLocation) => {
    this.addDataToStorage(data, FeatureConstants.ZIP_WEATHER_DATA);
    const getUpdatedData: Array<TLocation> = this.localStorage.get(
      FeatureConstants.ZIP_WEATHER_DATA
    );

    this.setUpdateWeatherData(getUpdatedData);
  };

  setUpdateWeatherData = (data?: Array<TLocation>) => {
    this.logger.debug("setUpdateWeatherData");

    this.isCurrentWeatherEnable =
      this.localStorage.get(FeatureConstants.ZIP_WEATHER_DATA) !== null &&
      this.localStorage.get(FeatureConstants.ZIP_WEATHER_DATA).length > 0
        ? true
        : false;
    if (this.isCurrentWeatherEnable) {
      this.weatherData = data;
    }
  };

  identify(index: any, item: TLocation) {
    return item.id;
  }

  addDataToStorage = (data: TLocation | string, FeatureConst: string) => {
    const exisitingData: Array<TLocation> = this.localStorage.get(FeatureConst);
    const addZipCode = {
      ...(data as TLocation),
      zipcode: this.addLocation.nativeElement.value,
    };
    if (exisitingData && exisitingData.length > 0) {
      const newData = [...new Set([...exisitingData, addZipCode])];
      this.logger.debug(`Checking ${FeatureConst} data`, newData);
      this.localStorage.set(FeatureConst, newData);
    } else {
      this.localStorage.set(FeatureConst, [addZipCode]);
    }
  };

  goToForecast = (weather: any) => {
    console.log("GotoForecast");
    return `forecast/${weather?.zipcode}`;
  };
}
