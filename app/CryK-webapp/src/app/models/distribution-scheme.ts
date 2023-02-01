import {CryptoDetails} from "./crypto-details";

export interface DistributionScheme extends CryptoDetails{
  isDefinedBy: CryptoDetails[];
  prefLabel: string[];
  description: string[];
}
