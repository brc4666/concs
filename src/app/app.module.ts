import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';

import { TradeListComponent } from './components/trade-list/trade-list.component';
import { PricingTermListComponent } from './components/pricing-term-list/pricing-term-list.component';
import { PricingContainerComponent } from './components/pricing-container/pricing-container.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    TradeListComponent,
    PricingTermListComponent,
    PricingContainerComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
