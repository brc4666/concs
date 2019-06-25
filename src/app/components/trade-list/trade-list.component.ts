import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Trade } from 'src/app/models/trade';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-trade-list',
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.scss']
})
export class TradeListComponent implements OnInit {
  private unsub: Subject<void> = new Subject<any>();

  trades$: Observable<Trade[]>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.trades$ = this.dataService.getObservable<Trade>(Trade);
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
