import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingContainerComponent } from './components/pricing-container/pricing-container.component';
import { TradeListComponent } from './components/trade-list/trade-list.component';

const routes: Routes = [
  { path: 'home', component: TradeListComponent },
  { path: 'pricingTerms', component: PricingContainerComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
