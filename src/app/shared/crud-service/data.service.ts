import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, concat, forkJoin } from 'rxjs';
import { catchError, tap, map} from 'rxjs/operators';
import * as _ from 'lodash';
import * as uuidv1 from 'uuid/v1';

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

  create<T extends IDataBaseObj>(model: IDataBaseModel<T>, objToCreate?: T) { // TODO sort out type
    const startingValue = this.getLatestValue(model);

    const newObjProps = this.addUUID(objToCreate);
    const newModelObj = new model(newObjProps);

    // Update front end optimistically
    this.cacheAndRefreshMany(model, this.replaceObjectInArray(this.getLatestValue(model), newModelObj));

    const url = `${this.endpoint}${model.tableName}`;
    this.setLoadingState(model, true);
    return this.http.post(url, newModelObj, this.httpOptions).pipe(
      catchError(handleHttpError),
      tap(
        res => {},
        err => this.cacheAndRefreshMany(model, startingValue),
        () => this.setLoadingState(model, false)
      )
    );
  }

  read<T>(model: IDataBaseModel<T>, query?: HttpParams | string | any): Observable<T[]> {
    const httpOpts = Object.assign({}, this.httpOptions);

    if (query) {
      httpOpts.params = this.createSearchParams(query);
    }

    const url = `${this.endpoint}${model.tableName}`;

    this.setLoadingState(model, true);
    return this.http.get<T[]>(url, httpOpts).pipe(
      catchError(handleHttpError),
      tap( (res: T[]) => {
        this.cacheAndRefreshMany(model, res);
        this.setLoadingState(model, false);
      })
    );
  }

  deleteMany<T extends IDataBaseObj>(model: IDataBaseModel<T>, objsToDelete: T[]): Observable<any> {
    const deleteSubs = objsToDelete.map(objToDelete => this.delete(model, objToDelete));
    return concat(...deleteSubs);
  }

  delete<T extends IDataBaseObj>(model: IDataBaseModel<T>, objToDelete: T): Observable<any> {
    const startingValue = this.getLatestValue(model);

    // Update front end optimistically
    this.cacheAndRefreshMany(model, this.removeById(startingValue, objToDelete.id));

    const url = `${this.endpoint}${model.tableName}/${objToDelete.id}`;

    this.setLoadingState(model, true);
    return this.http.delete<T[]>(url, this.httpOptions).pipe(
      catchError(handleHttpError),
      tap(
        res => {},
        err => {
          console.error('delete failed', err);
          this.cacheAndRefreshMany(model, startingValue);
        },
        () => this.setLoadingState(model, false)
      )
    );
  }

  updateMany<T extends IDataBaseObj>(model: IDataBaseModel<T>, newValues: T[]): Observable<any> {
    const valuesToUpdate = this.getChangedValues(model, newValues);

    const patchSubs = valuesToUpdate.map(objToUpdate => {
      return this.update(model, objToUpdate);
    });

    return concat(...patchSubs);
  }

  update<T extends IDataBaseObj>(model: IDataBaseModel<T>, objToUpdate: T): Observable<T> {
    const startingValue = this.getLatestValueById(model, objToUpdate.id);

    // Update front end optimistically
    this.cacheAndRefreshOne(model, objToUpdate);

    const url =  `${this.endpoint}${model.tableName}/${objToUpdate.id}`;

    this.setLoadingState(model, true);
    return this.http.patch<T>(url, objToUpdate, this.httpOptions).pipe(
      catchError(handleHttpError),
      tap(
        res => {},
        err => {
          // roll back to original version
          console.error('update failed', err);
          this.cacheAndRefreshOne(model, startingValue);
        },
        () => this.setLoadingState(model, true)
        )
    );

  }

  private addUUID<T extends IDataBaseObj>(sourceObject): T {
    return Object.assign({}, sourceObject, {id: uuidv1()});
  }

  private getChangedValues<T extends IDataBaseObj>(model: IDataBaseModel<T>, newValues: T[]): T[] {
    return newValues
      .map(newValue => ({new: newValue, old: this.getLatestValueById(model, newValue.id)}))
      .filter(valuePair => !_.isEqual(valuePair.new, valuePair.old))
      .map(valuePair => valuePair.new);
  }

  private getLatestValueById<T extends IDataBaseObj>(model: IDataBaseModel<T>, id): T {
    return this.getLatestValue(model).find(el => el.id === id);
  }

  private replaceObjectInArray<T extends IDataBaseObj>(sourceArray: T[], objToUpdate: T): T[] {
    const index = sourceArray.findIndex(el => el.id === objToUpdate.id);
    if (index === -1) {
      return [...sourceArray, objToUpdate];
     }
    return [...sourceArray.slice(0, index), objToUpdate, ...sourceArray.slice(index + 1)];
  }

  private getLatestValue<T>(model: IDataBaseModel<T>): T[] {
    return _.cloneDeep(this.subjectMap[model.tableName].getValue());
  }

  private removeById<T extends IDataBaseObj>(startingValue: T[], idToRemove: string): T[] {
    return startingValue.filter(el => el.id !== idToRemove);
  }

  private setCacheFromServerRecords<T>(model: IDataBaseModel<T>, value: T[]): void {
    this.cache[model.tableName] = [];
    value.forEach( (record: T) => {
      this.cache[model.tableName].push(new model(record));
    });
  }

  private refreshFromCache<T>(model: IDataBaseModel<T>): void {
    this.subjectMap[model.tableName].next(this.cache[model.tableName]);
  }

  private cacheAndRefreshMany<T>(model: IDataBaseModel<T>, value: T[]): void {
    this.setCacheFromServerRecords(model, value);
    this.refreshFromCache(model);
  }

  private cacheAndRefreshOne<T extends IDataBaseObj>(model: IDataBaseModel<T>, newValue: T): void {
    const currentValue = this.getLatestValue(model);
    const updatedValue = this.replaceObjectInArray(currentValue, newValue);
    this.cacheAndRefreshMany(model, updatedValue);
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
