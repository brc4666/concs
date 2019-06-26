import { Injectable } from '@angular/core';
import { IFieldDef } from '../models/_base';

@Injectable({
  providedIn: 'root'
})
export class GridHelperService {

  constructor() { }

  getGridColumnDef(field: IFieldDef) {
    return {
      field: field.name,
      headerName: field.label
    };
  }
}
