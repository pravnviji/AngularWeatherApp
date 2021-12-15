import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { Logger } from "src/app/core/logger.service";
import { Location } from "@angular/common";
import { IForecast } from "src/app/feature/models/weather.type";
import { WeatherService } from "src/app/feature/services/weather.service";
import { LocalStorageService } from "src/app/core/local.storage.service";
import { FeatureConstants } from "src/app/feature/utils";

@Component({
  selector: "ng-detail-location",
  templateUrl: "./detail-location.component.html",
  styleUrls: ["./detail-location.component.scss"],
})
export class DetailLocationComponent implements OnInit {
  zipCode!: string;
  locationName!: string;

  private weatherSubject: BehaviorSubject<IForecast[]> = new BehaviorSubject<
    IForecast[]
  >([]);
  weatherData$: Observable<IForecast[]> | undefined =
    this.weatherSubject.asObservable();

  constructor(
    private activatedRoute: ActivatedRoute,
    private logger: Logger,
    private weatherService: WeatherService,
    private location: Location,
    private localStorage: LocalStorageService
  ) {
    console.log("DetailLocationComponent");
  }

  ngOnInit(): void {
    this.logger.debug(`DetailLocationComponent :: oninit`);

    this.zipCode = this.activatedRoute.snapshot.paramMap.get(
      "zipcode"
    ) as string;

    this.weatherService
      .getForecast(this.zipCode)
      .subscribe((res) => this.weatherSubject.next(res));
    this.logger.debug(`zipCode`, this.zipCode);
    this.locationName = this.localStorage.get(FeatureConstants.LOCATION);
  }

  getImageUrl = (imageUrl: string) => {
    const image = this.weatherService.filterWeatherIcon(imageUrl);
    return image.main;
  };

  convertToCelcius = (temp: number) => {
    return this.weatherService.convertKtoC(temp);
  };

  navigateHome = () => {
    this.location.back();
  };
}
