import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricingTermService } from 'src/app/shared/pricing-term.service';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { ViewService } from 'src/app/shared/view.service';
import { takeUntil } from 'rxjs/operators';
import { IFieldDef } from 'src/app/models/_base';
import { IPricingTermModel } from 'src/app/shared/pricing-term-models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit, OnDestroy {
  models: IPricingTermModel<any>[];
  pricingTerms$: Observable<IPricingTermModel<any>>[];
  fieldDefs$: Observable<IFieldDef[]>[];

  private unsub: Subject<void> = new Subject<any>();

  private queryParams;

  constructor(
    private route: ActivatedRoute,
    private pricingTermService: PricingTermService,
    private dataService: DataService,
    private viewService: ViewService
  ) { }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.models = this.pricingTermService.getPricingTermModels();
    this.pricingTerms$ = this.getPricingTerms(this.models);
    this.fieldDefs$ = this.getFieldDefs(this.models);
    this.readFromDB();
  }

  private getPricingTerms(models): Observable<IPricingTermModel<any>>[] {
    return models.map(model => this.dataService.getObservable(model));
  }

  private getFieldDefs(models): Observable<IFieldDef[]>[] {
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
    return models.map(model => this.dataService.read(model, this.queryParams));
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }
}
