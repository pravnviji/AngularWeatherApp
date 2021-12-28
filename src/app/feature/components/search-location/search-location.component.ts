import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { debounceTime, Subscription } from "rxjs";
import { LocalStorageService } from "src/app/core/local.storage.service";
import { Logger } from "src/app/core/logger.service";
import { UntilDestroy } from "@ngneat/until-destroy";
import { TLocation } from "../../models/weather.type";
import { WeatherService } from "../../services";
import { FeatureConstants } from "../../utils";

@UntilDestroy({ checkProperties: true })
@Component({
  selector: "ng-search-location",
  templateUrl: "./search-location.component.html",
  styleUrls: ["./search-location.component.scss"],
})
export class SearchLocationComponent implements OnInit {
  @ViewChild("addLocation", { static: true })
  addLocation!: ElementRef;
  @ViewChild("btnSubmit", { static: true })
  private btnSubmit!: ElementRef;
  private sub: Subscription | undefined;

  public isCurrentWeatherEnable: boolean | false | undefined;
  public weatherData: Array<TLocation> | undefined;

  constructor(
    private router: Router,
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
    this.updateWeather(getWeatherData);
  }

  storeWeatherLocation = () => {
    this.logger.debug(":: storeWeatherLocation ::");
    const zipCode: string = this.addLocation.nativeElement.value;
    this.logger.debug(":: Zipcode ::", zipCode);
    if (this.checkDataToStorage() || !this.checkZipValid(zipCode)) {
      alert("Please enter the valid zipcode or already exist");
      return;
    }
    this.btnSubmit.nativeElement.disabled = true;
    this.sub = this.weatherService
      .getWeatherData(zipCode)
      .pipe(debounceTime(500))
      .subscribe((data) => {
        this.currentWeather(data);
        this.clearZipCode();
      });
  };

  checkZipValid = (zipCode: string): boolean => {
    const regEx = new RegExp("^[0-9]+$");
    return zipCode.length === 5 && regEx.test(zipCode);
  };

  clearZipCode = () => {
    this.addLocation.nativeElement.value = "";
    this.btnSubmit.nativeElement.disabled = false;
  };

  currentWeather = (data: TLocation) => {
    this.logger.debug(":: currentWeatherCondition ::");
    this.logger.debug("", data);
    this.addNewWeatherData(data);
  };

  addNewWeatherData = (data: TLocation) => {
    this.addDataToStorage(data, FeatureConstants.ZIP_WEATHER_DATA);
    const getUpdatedData: Array<TLocation> = this.localStorage.get(
      FeatureConstants.ZIP_WEATHER_DATA
    );

    this.updateWeather(getUpdatedData);
  };

  updateWeather = (data?: Array<TLocation>) => {
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

  checkDataToStorage = (): boolean => {
    this.logger.debug(`:: checkDataToStorage ::`);
    const exisitingData = this.localStorage.get(
      FeatureConstants.ZIP_WEATHER_DATA
    );
    let checkZipExist = null;
    if (exisitingData && exisitingData.length > 0) {
      checkZipExist = exisitingData.find(
        (item: any) => item.zipcode === this.addLocation.nativeElement.value
      );
    }
    this.logger.debug(``, checkZipExist);
    this.logger.debug(`check value`, !checkZipExist ? false : true);
    return !checkZipExist ? false : true;
  };

  addDataToStorage = (data: TLocation | string, FeatureConst: string) => {
    const exisitingData = this.localStorage.get(FeatureConst);
    const addZipCode = {
      ...(data as TLocation),
      zipcode: this.addLocation.nativeElement.value,
    };
    if (exisitingData && exisitingData.length > 0) {
      const checkZipExist = exisitingData.find(
        (item: any) => item.zipcode === this.addLocation.nativeElement.value
      );
      this.logger.debug(`checkZipExist`, checkZipExist);
      if (!checkZipExist) {
        const newData = [...exisitingData, addZipCode];
        this.logger.debug(`Checking ${FeatureConst} data`, newData);
        this.localStorage.set(FeatureConst, newData);
      } else {
        alert("Zipcode is already Added");
      }
    } else {
      this.localStorage.set(FeatureConst, [addZipCode]);
    }
  };

  goToForecast = (weather: any) => {
    this.localStorage.set(FeatureConstants.LOCATION, weather.name);
    this.router.navigate([`forecast/${weather?.zipcode}`]);
  };

  removeWeather = (id: string) => {
    this.logger.debug("removeWeatherData", id);
    const exisitingData: Array<TLocation> = this.localStorage.get(
      FeatureConstants.ZIP_WEATHER_DATA
    );
    const newDataArray: Array<TLocation> = exisitingData.filter(
      (item) => item.id !== id
    ) as Array<TLocation>;
    this.localStorage.set(FeatureConstants.ZIP_WEATHER_DATA, newDataArray);
    this.weatherData = newDataArray;
  };
}
