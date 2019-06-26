import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricingTermService } from 'src/app/shared/pricing-term.service';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { ViewService } from 'src/app/shared/view.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit, OnDestroy {
  models: any[];
  pricingTerms$ = [];
  fieldDefs$ = [];

  private unsub: Subject<void> = new Subject<any>();

  constructor(
    private pricingTermService: PricingTermService,
    private dataService: DataService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.models = this.pricingTermService.getPricingTermModels();
    this.pricingTerms$ = this.getPricingTerms(this.models);
    this.fieldDefs$ = this.getFieldDefs(this.models);
    this.readFromDB();
  }

  private getPricingTerms(models): Observable<any>[] {
    return models.map(model => this.dataService.getObservable(model));
  }

  private getFieldDefs(models): Observable<any>[] {
    return models.map(model => this.viewService.getFieldDefintions(model));
  }

  private readFromDB(): void {
    const readSubs = this.getReadSubs(this.models);

    forkJoin(readSubs).pipe(takeUntil(this.unsub)).subscribe(
      res => {},
      err => console.error(err)
    );
  }

  private getReadSubs(models): Observable<any>[] {
    return models.map(model => this.dataService.read(model));
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
