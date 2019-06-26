import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Trade } from 'src/app/models/trade';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { takeUntil, switchMap } from 'rxjs/operators';
import { IFieldDef } from 'src/app/models/_base';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-trade-list',
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.scss']
})
export class TradeListComponent implements OnInit {

  trades$: Observable<Trade[]>;
  fields$: Observable<IFieldDef[]>;

  constructor(
    private dataService: DataService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.trades$ = this.linkToStoreAndReadBackend();
    this.fields$ = this.viewService.getFieldDefintions(Trade);
  }

  linkToStoreAndReadBackend() {
    return this.dataService.read(Trade).pipe(
      switchMap(result => this.dataService.getObservable(Trade))
    );
  }
}
