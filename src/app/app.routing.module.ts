import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchLocationComponent } from "src/app/feature/components";

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    {
        path: "home",
        component: SearchLocationComponent,
    },
    {
        path: "forecast",
        loadChildren: () =>
            import("./feature/detail-forecast/detail-forecast.module").then(
                (mod) => mod.DetailForecastModule
            ),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
