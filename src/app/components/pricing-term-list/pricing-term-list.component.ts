import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPricingTermModel } from 'src/app/shared/pricing-term-map';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-pricing-term-list',
  templateUrl: './pricing-term-list.component.html',
  styleUrls: ['./pricing-term-list.component.scss']
})
export class PricingTermListComponent implements OnInit {
  @Input() title: string;
  @Input() rowData: IPricingTermModel<any>[];
  @Input() columnDefs: ColDef[];
  @Output() delete: EventEmitter<any[]> = new EventEmitter(); // TODO sort out type
  @Output() userUpdated: EventEmitter<any[]> = new EventEmitter();

  selectionExists: boolean; // TODO must be a way to do this without storing state here
  private selection;

  constructor() { }

ngOnInit() {
  }

  onSelectionChanged(event: any[]): void {
    this.selectionExists = event.length > 0;
    this.selection = event;
  }

  onDeleteClick(): void {
    if (this.selectionExists) {
      this.delete.emit(this.selection);
    }
  }

  onUserUpdated(event: any[]): void {
    console.log('pricing list component user updated', event);
    this.userUpdated.emit(event);
  }

}
