import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {url} from '../config/api';

interface Data {
  data: any;
  message: string;
  any?: any;
}

@Injectable({
  providedIn: 'root'
})

export class AppService {
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(
    private http: HttpClient
  ) {
  }

  uploadImg(data: object, httpOption: object): Observable<any> {
    return this.http.post<Data>(url.uploadImg, data, httpOption).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('uploadImg', {}))
    );
  }

  getQuesProblem(id: string): Observable<object[]> {
    const api = `${url.getQuesProblem}?quesId=${id}`;
    return this.http.get<Data>(api).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('getQuesProblem', []))
    );
  }

  getSortType(): Observable<object[]> {
    return this.http.get<Data>(url.getSortType).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object[]>('getSortType', []))
    );
  }

  getQuesData(data: object): Observable<object> {
    const api = `${url.getQuesData}?num=${(data as any).sortNum}&name=${(data as any).name}`;
    return this.http.get<Data>(api).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('getQuesData', []))
    );
  }

  // tslint:disable-next-line:typedef
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
