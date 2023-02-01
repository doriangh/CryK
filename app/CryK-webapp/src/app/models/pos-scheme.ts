import {CryptoDetails} from "./crypto-details";

export interface PosScheme extends CryptoDetails{
  isDefinedBy: string[];
  prefLabel: string[];
  description: string[];
}
