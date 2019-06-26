import { Component, OnInit, Input } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() rowData: any[];
  @Input() columnDefs: ColDef[];
  private gridApi: GridApi;

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params): void { // TODO, what is type of params?
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

}
