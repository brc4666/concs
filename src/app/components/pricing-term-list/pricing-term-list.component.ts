import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IPayableRule, PayableRule } from './../../models/payable-rule';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-term-list',
  templateUrl: './pricing-term-list.component.html',
  styleUrls: ['./pricing-term-list.component.scss']
})
export class PricingTermListComponent implements OnInit {
  private unsub: Subject<void> = new Subject<any>();

  pricingTerms$: Observable<PayableRule[]>;


  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.pricingTerms$ = this.dataService.getObservable(PayableRule);
    this.readFromDB();
  }

  readFromDB() {
    this.dataService.read(PayableRule).pipe(
      takeUntil(this.unsub)
    ).subscribe(
      res => {},
      err => console.error(err)
    );
  }
}
