import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { IPricingTermModel } from 'src/app/shared/pricing-term-models';
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

  selectionExists: boolean; // TODO make observable
  private selection;

  constructor() { }

  ngOnInit() {
  }

  onSelectionChanged(event: any[]): void {
    console.log(event);
    this.selectionExists = event.length > 0;
    this.selection = event;
  }

  onDeleteClick(): void {
    if (this.selectionExists) {
      this.delete.emit(this.selection);
    }
  }

}
