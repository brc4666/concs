import { Injectable } from '@angular/core';
import { PricingTermModels, IPricingTermModel, IPricingTerm, ConditionalPricingModels } from './pricing-term-map';
import { IFieldDef } from '../models/_base';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PricingTermService {

  constructor() { }

  getPricingTermModels<T>(): IPricingTermModel<T>[] {
    return Object.keys(PricingTermModels).map(key => PricingTermModels[key]);
  }

  getConditionalModels() {
    return Object.keys(ConditionalPricingModels);
  }

  getFlattenedModel(model) {
    if (model.conditionalFieldDefs) {
      return this.mergeConditionalFieldDefs(model);
    }
    return model;
  }

  mergeConditionalFieldDefs(model) {
    const standardFieldDefs = model.fieldDefs;
    const conditionalFieldDefs = model.conditionalFieldDefs;
    const mergedFieldDefs = [...standardFieldDefs, ...conditionalFieldDefs];
    return Object.assign({}, model, {fieldDefs: mergedFieldDefs});
  }

  flattenConditionalTerm(term) {
    if (term.conditions) {
      const standardTermPart = Object.assign({}, term);
      delete standardTermPart.conditions;
      return term.conditions.map(
        condition => {
          return Object.assign(
            {},
            condition,
            standardTermPart
          );
        }
      );
    }
    return term;
  }

  expandConditionalTerm(model, terms: any[]) {
    // TODO refactor this mess
    if (!model.conditionalFieldDefs) { return terms; }
    const standardFields = model.fieldDefs.map(def => def.name);
    if (model.conditionalFieldDefs) {
      const conditionalFields = model.conditionalFieldDefs.map(def => def.name);
    }

    let result = [];

    terms.forEach(
      term => {
        const findIndex = result.findIndex(el => el.id === term.id);
        if (findIndex >= 0) {
          const existingConditions = result[findIndex].conditions;
          const conditionToAdd = this.getConditionalFields(model, term);
          const updatedConditions = [...existingConditions, conditionToAdd];
          result[findIndex].conditions = updatedConditions;
        } else {
          let termToAdd = this.getStandardFields(model, term);
          const condtionToAdd = this.getConditionalFields(model, term);
          termToAdd = Object.assign({}, termToAdd, {conditions: [condtionToAdd]});
          result = [...result, termToAdd];
          // this.getStandardFields(model, term);

        }
      }
    );

    return result.map(term => new model(term));
  }

  private getStandardFields(model, term) {
    const result = {};
    const conditionalFields = model.conditionalFieldDefs.map(def => def.name);
    Object.keys(term).forEach(key => {
      if (!_.includes(conditionalFields, key)) {
        result[key] = term[key];
      }
    });
    return result;
  }

  private getConditionalFields(model, term) {
    const result = {};
    const conditionalFields = model.conditionalFieldDefs.map(def => def.name);
    Object.keys(term).forEach(key => {
      if (_.includes(conditionalFields, key)) {
        result[key] = term[key];
      }
    });
    return result;
  }

}
