import {CryptoDetails} from "./crypto-details";
import {Cryptocurrency} from "./cryptocurrency";

export interface Price extends CryptoDetails{
  value: number;
  exchange: Cryptocurrency[];
  updatedAt: string[];
}
