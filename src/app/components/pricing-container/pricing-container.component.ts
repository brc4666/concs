import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricingTermService } from 'src/app/shared/pricing-term.service';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { ViewService } from 'src/app/shared/view.service';
import { takeUntil, map } from 'rxjs/operators';
import { IFieldDef, IDataBaseObj } from 'src/app/models/_base';
import { IPricingTermModel } from 'src/app/shared/pricing-term-models';
import { ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { GridHelperService } from 'src/app/shared/grid-helper.service';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit, OnDestroy {
  models: IPricingTermModel<any>[];
  pricingTerms$: Observable<IPricingTermModel<any>>[];
  fieldDefs$: Observable<IFieldDef[]>[];
  gridColDefs$: Observable<ColDef[]>[];

  private unsub: Subject<void> = new Subject<any>();

  private queryParams;

  constructor(
    private route: ActivatedRoute,
    private pricingTermService: PricingTermService,
    private dataService: DataService,
    private viewService: ViewService,
    private gridHelper: GridHelperService
  ) { }

  ngOnInit() {
    this.queryParams = this.route.snapshot.queryParams;
    this.models = this.pricingTermService.getPricingTermModels();
    this.pricingTerms$ = this.getPricingTerms(this.models);
    this.fieldDefs$ = this.getFieldDefs(this.models);
    this.gridColDefs$ = this.getGridColDefs(this.models);
    this.readFromDB();  // TODO, should be able to replace this with switchmap
  }

  onDelete<T extends IDataBaseObj>(model: IPricingTermModel<T>, event: T[]): void {
    // TODO, batch up calls to delete, as the second http call is hitting the server while it's reloading and crashing the server
    if (event.length > 1) {
      console.error('can only delete one at a time')
      return;
    }
    event.forEach(record => this.dataService.delete(model, record).subscribe(
      res => {},
      err => console.error('delete error', err)
      )
    );
  }

  private getPricingTerms(models): Observable<IPricingTermModel<any>>[] {
    return models.map(model => this.dataService.getObservable(model));
  }

  private getFieldDefs(models): Observable<IFieldDef[]>[] {
    return models.map(model => this.viewService.getFieldDefintions(model));
  }

  private getGridColDefs(models): Observable<ColDef[]>[] {
    return models.map(model => this.viewService.getFieldDefintions(model).pipe(
      map(this.gridHelper.getGridColumnDefs),
      map(this.gridHelper.addSelectorColumn)
    ));
  }

  private readFromDB(): void {
    const readSubs = this.getReadSubs(this.models);

    forkJoin(readSubs).pipe(takeUntil(this.unsub)).subscribe(
      res => console.log('read successful', res),
      err => console.error('read error', err)
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
