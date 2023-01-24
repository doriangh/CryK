import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {catchError, Observable, of, tap} from "rxjs";
import {Cryptocurrency} from "../models/cryptocurrency";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    })
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getCoins() : Observable<Cryptocurrency[]>{
    return this.http.get<Cryptocurrency[]>('http://localhost:3000/coins', this.httpOptions)
      .pipe(
        tap(_ => this.log('fetched coins')),
        catchError(this.handleError<Cryptocurrency[]>('getCoins', []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add({severity: 'success', summary: 'Got data', detail: message});
  }
}
