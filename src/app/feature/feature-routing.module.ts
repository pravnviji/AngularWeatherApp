import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailLocationComponent } from './components/detail-location/detail-location.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';

const routes: Routes = [{
  path: '',
  component: SearchLocationComponent
}, {
  path: 'forecast/:id',
  component: DetailLocationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
