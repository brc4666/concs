import { Injectable } from '@angular/core';
import { IFieldDef } from '../models/_base';
import { ColDef } from 'ag-grid-community';

@Injectable({
  providedIn: 'root'
})
export class GridHelperService {

  constructor() { }

  private getGridColumnDef(field: IFieldDef): ColDef {
    return {
      field: field.name,
      headerName: field.label,
      editable: field.editable || true,
    };
  }

  getGridColumnDefs = (fields: IFieldDef[]): ColDef[] => {
    return fields.map(field => this.getGridColumnDef(field));
  }

  addSelectorColumn = (colDefs: ColDef[]): ColDef[] => {
    return [this.selectorColumn, ...colDefs];
  }

  private get selectorColumn(): ColDef {
    return {
      field: 'select',
      headerName: '',
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 50
    };
  }

  getConditionalFields() {
    return [
      {field: 'payableContent'},
      {field: 'minDeduction'}
    ]
  }
}
