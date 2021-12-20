import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchLocationComponent } from "./components/";

const routes: Routes = [
  {
    path: "",
    component: SearchLocationComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
