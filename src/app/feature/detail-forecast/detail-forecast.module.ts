import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DetailForecastRoutingModule } from "./detail-forecast-routing.module";
import { DetailLocationComponent } from "./component";

@NgModule({
  declarations: [DetailLocationComponent],
  imports: [CommonModule, DetailForecastRoutingModule],
})
export class DetailForecastModule {}
