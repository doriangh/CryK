import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {catchError, map, Observable, of, Subscription, tap} from "rxjs";
import {Helpers} from "../../helpers/helpers";
import {ExchangeDataResponse} from "../../models/exchange-data-response";
import {PriceHistory} from "../../models/price-history";
import {FilterInterval} from "../../models/filter-interval";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {Price} from "../../models/price";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    })
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
  }


  getCoinExchangeData(fromCoin: string[], toCoin: string): Observable<ExchangeDataResponse> {

    let queryModel = new Helpers(fromCoin, toCoin).toString();

    console.log(queryModel.toString());

    return this.http.get<ExchangeDataResponse>(environment.apiUrl + 'exchange?symbols=' + encodeURIComponent(new Helpers(fromCoin, toCoin).toString()))
      .pipe(
        // tap(_ => this.log('fetched exchange data')),
        catchError(this.handleError<ExchangeDataResponse>('getCoinExchangeData'))
      );
  }

  getCoinPriceHistory(coin: string, interval?: FilterInterval, startTimeUTC?: number, endTimeUTC?: number): Observable<PriceHistory> {

    let uri = environment.apiUrl + 'historic?';

    uri += 'symbol=' + coin;

    if (interval != undefined)
      uri += '&interval=' + interval;

    if (startTimeUTC != undefined && endTimeUTC != undefined) {
      uri += '&startTimeUTC=' + startTimeUTC;
      uri += '&endTimeUTC=' + endTimeUTC;
    }

    return this.http.get<PriceHistory>(uri)
      .pipe(
        tap(x => console.log(x)),
        catchError(this.handleError<PriceHistory>('getCoinPriceHistory'))
      );
  }

  getCoinDetails(coin: string): Observable<any> {
    return this.http.post<any>(environment.graphqlUri, {
      query: `
      {
        Cryptocurrency_GET_BY_ID(uris: ["http://purl.org/net/bel-epa/doacc#${coin}"])
        {
          _type
          _id
          symbol
          totalCoins
          prefLabel(lang: "en")
          description
          website
          image
          comment
          source
          dateFounded
          retargetTime
          incept
          rewardModifier
          blockReward
          maturation
          confirmations
          cloneOf
          {
            _id
            _type
            symbol
          }
          price
          {
            value
            updatedAt
          }
          blockTime
          distributionScheme
          {
            description(lang: "en")
            prefLabel(lang: "en")
          }
          pow
          {
            description(lang: "en")
            prefLabel(lang: "en")
          }
          pos
          {
            description(lang: "en")
            prefLabel(lang: "en")
          }
          premine
          protectionScheme
          {
            description(lang: "en")
            prefLabel(lang: "en")
          }
          protocol
          {
            prefLabel
            description
          }
        }
      }
        `
    }).pipe(
      map(result => result.data.Cryptocurrency_GET_BY_ID[0]),
      catchError(this.handleError<any>('getCoins'))
    );
  }
  getCryptoCoins(limit?: number, offset?: number): Observable<Cryptocurrency[]>{
    return this.http.post<any>(environment.graphqlUri, {
      query: `
      {
        Cryptocurrency_GET${limit != undefined && offset != undefined ? "(limit: " + limit + ", offset: " + offset + ")" : ""}
        {
          _id
          _type
          symbol
          image
          prefLabel (lang: "en")
          price
          {
            value
            updatedAt
            exchange
            {
              symbol
            }
          }
        }
      }`
    }).pipe(
      map(result => {
        return result.data.Cryptocurrency_GET;
      }),
      catchError(this.handleError('getCoins', []))
    );
  }

  getTopCryptoCoins(): Observable<Cryptocurrency[]>{
    // @ts-ignore
    return this.http.post<any>(environment.graphqlUri, {
      query: `
      {
        Cryptocurrency_GET_BY_ID(uris: [
          "http://purl.org/net/bel-epa/doacc#BTC",
          "http://purl.org/net/bel-epa/doacc#ETH",
          "http://purl.org/net/bel-epa/doacc#BNB",
          "http://purl.org/net/bel-epa/doacc#XRP",
          "http://purl.org/net/bel-epa/doacc#DOGE",
          "http://purl.org/net/bel-epa/doacc#DOT",
          "http://purl.org/net/bel-epa/doacc#UNI",
          "http://purl.org/net/bel-epa/doacc#LTC",
          "http://purl.org/net/bel-epa/doacc#LINK",
          "http://purl.org/net/bel-epa/doacc#BCH",
          "http://purl.org/net/bel-epa/doacc#XLM",
          ])
        {
          _type
          _id
          symbol
          totalCoins
          prefLabel(lang: "en")
          description
          website
          image
          comment
          source
          dateFounded
          price {
            value
          }
        }
      }
        `
    }).pipe(
      map(result => result.data.Cryptocurrency_GET_BY_ID),
      catchError(this.handleError('getCoins'))
    );
  }

  getPriceById(coinSymbol: string): Observable<Price[]>{
    return this.http.post<any>(environment.graphqlUri, {
      query: `
      {
        Price_GET_BY_ID(uris: ["http://www.ontologicalpirates.ro/resource#${coinSymbol}_PRICE"])
        {
          value
          updatedAt
          exchange
          {
            _id
          }
        }
      }`
    }).pipe(
      map(result => {
        return result.data.Price_GET_BY_ID;
      }),
      catchError(this.handleError<Price[]>('getCoins'))
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
