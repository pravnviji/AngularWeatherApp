import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetailLocationComponent } from "./component";

const routes: Routes = [
  {
    path: "forecast/:zipcode",
    component: DetailLocationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailForecastRoutingModule {}
