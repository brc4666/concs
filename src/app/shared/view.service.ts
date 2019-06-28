import { Injectable } from '@angular/core';
import { IViewable, IFieldDef } from '../models/_base';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  constructor() { }

  getFieldDefintions<T>(model: IViewable<T>): Observable<IFieldDef[]> {
    return of(model.fieldDefs);
  }

  getConditionalFieldDefinitions(model) {
    return of(model.conditionalFieldDefs);
  }

  getViewTitle<T>(model: IViewable<T>): string {
    return model.viewTitle;
  }
}
