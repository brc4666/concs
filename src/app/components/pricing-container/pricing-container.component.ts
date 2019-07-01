import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricingTermService } from 'src/app/shared/pricing-term.service';
import { DataService } from 'src/app/shared/crud-service/data.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { ViewService } from 'src/app/shared/view.service';
import { takeUntil, map, tap } from 'rxjs/operators';
import { IFieldDef, IDataBaseObj, } from 'src/app/models/_base';
import { IPricingTermModel, IPricingTerm } from 'src/app/shared/pricing-term-map';
import { ActivatedRoute } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { GridHelperService } from 'src/app/shared/grid-helper.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-pricing-container',
  templateUrl: './pricing-container.component.html',
  styleUrls: ['./pricing-container.component.scss']
})
export class PricingContainerComponent implements OnInit, OnDestroy {
  models: IPricingTermModel<any>[];
  conditionalModels;
  pricingTermsMap$: PricingTermsMap;
  gridColDefsMap$: GridColDefsMap;
  conditionalTermsMap$; // TODO sort out type;
  conditionalColDefsMap$;

  private unsub: Subject<void> = new Subject<any>();

  private queryParams;

  selectionExists: {[tableName: string]: boolean} = {}; // TODO must be a way to do this without storing state here
  private selection: {[tableName: string]: any} = {};

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
    this.conditionalModels = this.pricingTermService.getConditionalModels();
    this.pricingTermsMap$ = this.getPricingTermsMap(this.models);
    this.conditionalTermsMap$ = this.getConditionalTermsMap(this.models);
    this.gridColDefsMap$ = this.getGridColDefsMap(this.models);
    this.conditionalColDefsMap$ = this.getConditionalGridColDefsMap(this.models);
    this.readFromDB();  // TODO, should be able to replace this with switchmap
  }

  onAdd<T extends IDataBaseObj & IPricingTerm>(model: IPricingTermModel<T>): void {
    this.dataService.create(model, this.queryParams).subscribe();
  }

  onDelete<T extends IDataBaseObj>(model: IPricingTermModel<T>): void {
    if (this.selectionExists) {
      this.dataService.deleteMany(model, this.selection[model.tableName]).subscribe();
    }
  }

  onUserUpdated<T extends IDataBaseObj>(model: IPricingTermModel<T>, event: any[]): void {
    this.dataService.updateMany(model, event).subscribe();
  }

  onSelectionChanged<T extends IDataBaseObj>(model: IPricingTermModel<T>, event: T[]): void {
    this.selectionExists[model.tableName] = event.length > 0;
    this.selection[model.tableName] = event;
  }

  private getPricingTermsMap<T>(models: IPricingTermModel<T>[]): PricingTermsMap {
    return models.reduce( (acc, cur) => {
      acc[cur.tableName] = this.getPricingTerms(cur);
      return acc;
      }, {});
  }

  private getPricingTerms<T>(model: IPricingTermModel<T>): Observable<T[]> {
    return this.dataService.getObservable(model);
  }

  private getConditionalTermsMap(models) {
    return models.reduce( (acc, cur) => {
      acc[cur.tableName] = this.getPricingTerms(cur).pipe(
        map(termArray => _.flatten(termArray.map(this.getConditionalTerms)))
      );
      return acc;
    }, {});
  }

  private getConditionalTerms(pricingTerm) {
    if (pricingTerm.conditions) { 
      return pricingTerm.conditions; }
    return {};
  }

  private getGridColDefsMap<T>(models: IPricingTermModel<T>[]): GridColDefsMap {
    return models.reduce( (acc, cur) => {
      acc[cur.tableName] = this.getGridColDef(cur);
      return acc;
    }, {});
  }

  private getGridColDef<T>(model: IPricingTermModel<T>): Observable<ColDef[]> {
    return this.viewService.getFieldDefintions(model).pipe(
      map(this.gridHelper.getGridColumnDefs),
      map(this.gridHelper.addSelectorColumn)
    );
  }

  private getConditionalGridColDefsMap(models) {
    return models.reduce( (acc, cur) => {
      acc[cur.tableName] = this.getConditionalGridColDef(cur);
      return acc;
    }, {});
  }

  private getConditionalGridColDef(model) {
    return this.viewService.getConditionalFieldDefinitions(model).pipe(
      map(this.gridHelper.getGridColumnDefs)
    )
  }

  private readFromDB(): void {
    const readSubs = this.getReadSubs(this.models);

    forkJoin(readSubs).pipe(takeUntil(this.unsub)).subscribe(
      res => {},
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

interface PricingTermsMap {
  [tableName: string]: Observable<IPricingTerm[]>;
}

interface GridColDefsMap {
  [tableName: string]: Observable<ColDef[]>;
}
