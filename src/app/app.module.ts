import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { FeatureModule } from "./feature/feature.module";
import { CoreModule } from "./core/core.module";
import { AppRoutingModule } from "./app.routing.module";
import { DetailForecastModule } from "./feature/detail-forecast/detail-forecast.module";
import { RouteReuseStrategy } from "@angular/router";
import { RouteReusableStrategy } from "./core/route-reusable-strategy";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CoreModule,
    FeatureModule,
    DetailForecastModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  providers: [{ provide: RouteReuseStrategy, useClass: RouteReusableStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
