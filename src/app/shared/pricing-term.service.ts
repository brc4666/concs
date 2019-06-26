import { Injectable } from '@angular/core';
import { IDataBaseModel } from '../models/_base';
import { PricingTermModels } from './pricing-term-models';

@Injectable({
  providedIn: 'root'
})
export class PricingTermService {

  constructor() { }

  getPricingTermModels<T>(): IDataBaseModel<T>[] {
    return Object.keys(PricingTermModels).map(key => PricingTermModels[key]);
  }
}
