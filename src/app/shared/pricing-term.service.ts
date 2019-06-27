import { Injectable } from '@angular/core';
import { PricingTermModels, IPricingTermModel, IPricingTerm } from './pricing-term-map';

@Injectable({
  providedIn: 'root'
})
export class PricingTermService {

  constructor() { }

  getPricingTermModels<T>(): IPricingTermModel<T>[] {
    return Object.keys(PricingTermModels).map(key => PricingTermModels[key]);
  }
}
