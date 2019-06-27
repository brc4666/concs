import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import * as _ from 'lodash';

import { environment } from 'src/environments/environment';
import { TableMap } from '../table-map';
import { IDataBaseModel, IDataBaseObj } from 'src/app/models/_base';
import { handleHttpError } from './utilities';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private endpoint: string = environment.serverUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    params: new HttpParams()
  };

  private cache: Cache = {};
  private subjectMap: SubjectMap = {};
  private loadingMap: LoadingMap = {};

  constructor(
    private http: HttpClient
  ) {
    this.setupLocalProps();
  }

  private setupLocalProps(): void {
    Object.keys(TableMap).forEach( table => {
      this.loadingMap[TableMap[table]] = new BehaviorSubject(false);
      this.subjectMap[TableMap[table]] = new BehaviorSubject([]);
    });
  }

  /**
   * PUBLIC API
   */

  getObservable<T>(model: IDataBaseModel<T>): Observable<T[]> {
    return this.subjectMap[model.tableName].asObservable().pipe(
      map(result => _.cloneDeep(result))
    );

  }

  read<T>(model: IDataBaseModel<T>, query?: HttpParams | string | any): Observable<T[]> {
    this.setLoadingState(model, true);

    const httpOpts = Object.assign({}, this.httpOptions);

    if (query) {
      httpOpts.params = this.createSearchParams(query);
    }

    const url = `${this.endpoint}${model.tableName}`;

    return this.http.get<T[]>(url, httpOpts).pipe(
      catchError(handleHttpError),
      tap( (res: T[]) => {
        this.cacheAndRefresh(model, res);
        this.setLoadingState(model, false);
      })
    );
  }

  delete<T extends IDataBaseObj>(model: IDataBaseModel<T>, objToDelete: T): Observable<any> {
    const startingValue = this.getLatestValue(model);

    this.setLoadingState(model, true);

    this.setCache(model, this.removeById(startingValue, objToDelete.id));
    this.refreshFromCache(model);

    const url = `${this.endpoint}${model.tableName}/${objToDelete.id}`;

    return this.http.delete<T[]>(url, this.httpOptions).pipe(
      catchError(handleHttpError),
      tap(
        res => {
          this.setLoadingState(model, false);  // TODO factor into finally?
        },
        err => {
          console.error('delete failed', err);
          this.cacheAndRefresh(model, startingValue);
          this.setLoadingState(model, false);
        }
      )
    );
  }

  updateInMemory<T extends IDataBaseObj>(model: IDataBaseModel<T>, newValues: T[]): void {
    const startingValue = this.getLatestValue(model);
    console.log('value before update is ', startingValue);
    this.cacheAndRefresh(model, newValues);
    console.log('value after update is ', this.getLatestValue(model));
  }

  private getLatestValue<T>(model: IDataBaseModel<T>): T[] {
    return _.cloneDeep(this.subjectMap[model.tableName].getValue());
  }

  private removeById<T extends IDataBaseObj>(startingValue: T[], idToRemove: string): T[] {
    return startingValue.filter(el => el.id !== idToRemove);
  }

  private setCache<T>(model: IDataBaseModel<T>, value: T[]): void {
    this.cache[model.tableName] = [];
    value.forEach( (record: T) => {
      this.cache[model.tableName].push(new model(record));
    });
  }

  private refreshFromCache<T>(model: IDataBaseModel<T>): void {
    this.subjectMap[model.tableName].next(this.cache[model.tableName]);
  }

  private cacheAndRefresh<T>(model: IDataBaseModel<T>, value: T[]): void {
    this.setCache(model, value);
    this.refreshFromCache(model);
  }

  private createSearchParams(query: HttpParams | string | any): HttpParams {
    if (typeof query === 'string') { return this.splitSearchString(query); }
    if (query instanceof HttpParams) { return query; }
    return this.splitSearchObject(query);
  }

  private splitSearchString(query: string) {
    let searchParams = new HttpParams();
    const splitQuery = query.split('&');
    splitQuery.forEach(param => {
      const keyValPair = param.split('=');
      searchParams = searchParams.set(keyValPair[0], keyValPair[1]);
    });
    return searchParams;
  }

  private splitSearchObject(query: any) {
    let searchParams = new HttpParams();
    Object.keys(query).forEach(key => searchParams = searchParams.set(key, query[key]));
    return searchParams;
  }

  private setLoadingState<T>(model: IDataBaseModel<T>, state: boolean): void {
    this.loadingMap[model.tableName].next(state);
  }
}

interface Cache {
  [tableName: string]: any[];
}

interface SubjectMap {
  [tableName: string]: BehaviorSubject<any[]>;
}

interface LoadingMap {
  [tableName: string]: BehaviorSubject<boolean>;
}
