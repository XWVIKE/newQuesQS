import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { url } from '../config/api';

interface Data {
  data: any;
  message: string;
  any?: any;
}

@Injectable({
  providedIn: 'root'
})

export class AppService {
  constructor(
    private http: HttpClient
  ) {
  }

  addParse(data: object): Observable<any> {
    return this.http.post<Data>(url.addParse, data).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('addParse', {}))
    );
  }

  record(data: object): Observable<any> {
    const api = `${url.record}?num=${(data as any).num}&quesId=${(data as any).quesId}&status=${(data as any).status}`;
    console.log(data);
    console.log(api);
    return this.http.get<Data>(api).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('record', {}))
    );
  }

  updateOption(data: object): Observable<any> {
    return this.http.post<Data>(url.updateOption, data).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('updateOption', {}))
    );
  }

  updateParse(data: object): Observable<any> {
    return this.http.post<Data>(url.updateParse, data).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('updateParse', {}))
    );
  }

  uploadImg(data: object, httpOption: object): Observable<any> {
    return this.http.post<Data>(url.uploadImg, data, httpOption).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('uploadImg', {}))
    );
  }

  addQuesProblem(data: object): Observable<any> {
    return this.http.post<Data>(url.addQuesProblem, data).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('addQuesProblem', []))
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

  login(data: object): Observable<any> {
    return this.http.post<Data>(url.goLogin, data).pipe(
      // switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('login', {}))
    );
  }

  register(data: object): Observable<any> {
    return this.http.post<Data>(url.goRegister, data).pipe(
      // switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('register', {}))
    );
  }


  getUserInfo(data: object): Observable<any> {
    return this.http.get<Data>(url.getUserInfo, data).pipe(
      switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('getUserInfo', {}))
    );
  }

  
  editPassword(data: object): Observable<any> {
    return this.http.post<Data>(url.editPassword, data).pipe(
      // switchMap(_ => of(_.data)),
      catchError(this.handleError<object>('editPassword', {}))
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
