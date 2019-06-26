import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Input() rowData: any[];
  @Input() columnDefs: ColDef[];
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter();
  private gridApi: GridApi;

  constructor() { }

  ngOnInit() {
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged(): void {
    this.selectionChanged.emit(this.gridApi.getSelectedRows());
  }

}
