import {ExchangeData} from "./exchange-data";

export interface ExchangeDataResponse {
  errorMessage: string;
  exchangeData: ExchangeData[];
  serverUtcDate: string;
}
