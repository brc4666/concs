import { Injectable } from '@angular/core';
import { IFieldDef } from '../models/_base';
import { ColDef } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class GridHelperService {

  constructor() { }

  getGridColumnDef(field: IFieldDef): ColDef {
    return {
      field: field.name,
      headerName: field.label
    };
  }

  getGridColumnDefs(fields: IFieldDef[]): ColDef[] {
    return fields.map(field => this.getGridColumnDef(field));
  }

  get selectorColumn(): ColDef {
    return {
      field: 'select',
      headerName: '',
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 50
    }
  }
}
