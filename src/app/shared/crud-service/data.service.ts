import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { TableMap } from '../table-map';
import { IDataBaseObj, IDataBaseModel } from 'src/app/models/_base';
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

  private isOptimistic = true;

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

  getObservable<T>(model: T | any): Observable<T[]> {
    return this.subjectMap[model.tableName].asObservable();
  }

  read<T>(model: T | any, query?: HttpParams | string | any): Observable<T[]> {
    this.setLoadingState(model, true);

    const httpOpts = Object.assign({}, this.httpOptions);

    if (query) {
      httpOpts.params = this.createSearchParams(query);
    }

    const url = `${this.endpoint}${model.tableName}`;

    return this.http.get<T[]>(url, httpOpts).pipe(
      catchError(handleHttpError),
      tap( (res: T[]) => this.cacheAndNotifyRead(model, res))
    );
  }

  cacheAndNotifyRead<T>(model: T | any, res: T[]): void {
    this.cache[model.tableName] = [];
    res.forEach( (record: T) => {
      this.cache[model.tableName].push(new model(record));
    });
    this.subjectMap[model.tableName].next(this.cache[model.tableName]);
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

  private setLoadingState<T>(model: T | any, state: boolean): void {
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

interface Constructable<T> {
  new (props): T;
}