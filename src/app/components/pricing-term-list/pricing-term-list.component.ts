import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PayableRule } from './../../models/payable-rule';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { takeUntil } from 'rxjs/operators';
import { IFieldDef } from 'src/app/models/_base';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-pricing-term-list',
  templateUrl: './pricing-term-list.component.html',
  styleUrls: ['./pricing-term-list.component.scss']
})
export class PricingTermListComponent implements OnInit {
  @Input() model: any;
  private unsub: Subject<void> = new Subject<any>();

  pricingTerms$: Observable<PayableRule[]>;
  fields$: Observable<IFieldDef[]>;


  constructor(
    private dataService: DataService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.pricingTerms$ = this.dataService.getObservable(this.model);
    this.fields$ = this.viewService.getFieldDefintions(this.model);
    this.readFromDB();
  }

  readFromDB() {
    this.dataService.read(this.model).pipe(
      takeUntil(this.unsub)
    ).subscribe(
      res => {},
      err => console.error(err)
    );
  }
}
