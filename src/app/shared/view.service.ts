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

  getViewTitle<T>(model: IViewable<T>): string {
    return model.viewTitle;
  }
}
