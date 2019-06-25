import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TradeListComponent } from './components/trade-list/trade-list.component';
import { PricingTermListComponent } from './components/pricing-term-list/pricing-term-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TradeListComponent,
    PricingTermListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
