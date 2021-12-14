import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { FeatureRoutingModule } from './feature-routing.module';

@NgModule({
  declarations: [
    SearchLocationComponent
  ],
  imports: [
    CommonModule, FeatureRoutingModule

  ],
  exports: [
    SearchLocationComponent
  ]
})
export class FeatureModule { }
