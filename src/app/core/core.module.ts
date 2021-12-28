import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { RouteReusableStrategy } from "./route-reusable-strategy";
import { HttpRequestService } from "./http/http-request.service";
import { LocalStorageService } from "./local.storage.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
    HttpRequestService,
    LocalStorageService,
  ],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(
        `${parentModule} has already been loaded. Import Core module in the AppModule only.`
      );
    }
  }
}
