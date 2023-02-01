import {CryptoDetails} from "./crypto-details";

export interface PoWScheme extends CryptoDetails{
  isDefinedBy: CryptoDetails[];
  prefLabel: string[];
  description: string[];
}
