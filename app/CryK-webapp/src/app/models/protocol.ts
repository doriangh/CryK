import {CryptoDetails} from "./crypto-details";

export interface Protocol extends CryptoDetails{
  isDefinedBy: CryptoDetails[];
  prefLabel: string[];
  description: string[];
}
