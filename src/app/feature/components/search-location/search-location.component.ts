import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { zip } from "rxjs";
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

    this.isCurrentWeatherEnable = this.localStorage.get(
      FeatureConstants.WEATHER_DATA
    ).length > 0 ? true : false;
  }
  storeWeatherLocation = () => {
    this.logger.debug(":: storeWeatherLocation ::");
    const zipCode: string = this.addLocation.nativeElement.value;
    this.logger.debug(":: Zipcode ::", zipCode);
    if (!this.checkZipValid(zipCode)) {
      alert("Please enter the valid zipcode")
      return;
    }
    this.weatherService.getWeatherData(zipCode).subscribe((data) => {
      this.addNewZipCodes(zipCode);
      this.currentWeatherCondition(data);
      this.clearZipCode();
    });
  };

  addNewZipCodes = (zipCode: string) => {
    const existingZipCodes: Array<string> = this.localStorage.get(
      FeatureConstants.ZIP_CODES
    );
    if (existingZipCodes && existingZipCodes.length > 0) {
      const newZipCodes = [...new Set([...existingZipCodes, zipCode])];
      this.logger.debug("Checking newZipcode", newZipCodes);
      this.localStorage.set(FeatureConstants.ZIP_CODES, newZipCodes);
    } else {
      this.localStorage.set(FeatureConstants.ZIP_CODES, [zipCode]);
    }
  };

  checkZipValid = (zipCode: string): boolean => {
    const regEx = new RegExp('^[0-9]+$');
    return zipCode.length === 5 && regEx.test(zipCode);
  };

  clearZipCode = () => {
    this.addLocation.nativeElement.value = "";
  };


  currentWeatherCondition = (data: TLocation) => {
    this.logger.debug(":: currentWeatherCondition ::");
    this.logger.debug("", data);
    this.addNewWeatherData(data);
  }

  addNewWeatherData = (data: TLocation) => {
    const existingWeatherData: Array<TLocation> = this.localStorage.get(
      FeatureConstants.WEATHER_DATA
    );
    if (existingWeatherData && existingWeatherData.length > 0) {
      const newZipCodes = [...new Set([...existingWeatherData, data])];
      this.logger.debug("Checking newWeatherData", newZipCodes);
      this.localStorage.set(FeatureConstants.WEATHER_DATA, newZipCodes);
    } else {
      this.localStorage.set(FeatureConstants.WEATHER_DATA, [data]);
    }
    const getUpdatedData: Array<TLocation> = this.localStorage.get(
      FeatureConstants.WEATHER_DATA
    );

    this.setUpdateWeatherData(getUpdatedData)
    this.isCurrentWeatherEnable = true;
  }

  setUpdateWeatherData = (data: Array<TLocation>) => {
    this.logger.debug("setUpdateWeatherData");
    this.logger.debug('', data);
    this.weatherData = data;
  }
}
