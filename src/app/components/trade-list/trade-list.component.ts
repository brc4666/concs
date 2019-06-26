import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Trade } from 'src/app/models/trade';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { takeUntil } from 'rxjs/operators';
import { IFieldDef } from 'src/app/models/_base';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-trade-list',
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.scss']
})
export class TradeListComponent implements OnInit {
  private unsub: Subject<void> = new Subject<any>();

  trades$: Observable<Trade[]>;
  fields$: Observable<IFieldDef[]>;

  constructor(
    private dataService: DataService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.trades$ = this.dataService.getObservable(Trade);
    this.fields$ = this.viewService.getFieldDefintions(Trade);
    this.readFromDB();
  }

  readFromDB() {
    this.dataService.read(Trade).pipe(
        takeUntil(this.unsub)
      ).subscribe(
        res => {},
        err => console.error(err)
      );
  }

}
