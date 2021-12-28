import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Logger } from "src/app/core/logger.service";
import { Location } from "@angular/common";
import { TForecast } from "src/app/feature/models/weather.type";
import { WeatherService } from "src/app/feature/services";
import { LocalStorageService } from "src/app/core/local.storage.service";
import { FeatureConstants } from "src/app/feature/utils";
import { UntilDestroy } from "@ngneat/until-destroy";

@UntilDestroy({ checkProperties: true })
@Component({
  selector: "ng-detail-location",
  templateUrl: "./detail-location.component.html",
  styleUrls: ["./detail-location.component.scss"],
})
export class DetailLocationComponent implements OnInit {
  zipCode!: string;
  locationName!: string;

  public weatherData$: Observable<TForecast[]> | undefined =
    this.weatherService.forecastData$;

  private sub: Subscription | undefined;

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
    this.weatherService.getForecast(this.zipCode);

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
