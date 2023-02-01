import {Kline} from "./kline";

export interface PriceHistory {
  dates: string[];
  errorMessage: string;
  kline: Kline[];
  prices: number[];
  serverUtcDate: string;
}
