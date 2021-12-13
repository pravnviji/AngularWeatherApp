import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';

@NgModule({
  imports: [BrowserModule, FormsModule, FeatureModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
