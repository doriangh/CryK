import {CryptoDetails} from "./crypto-details";

export interface ProtectionScheme extends CryptoDetails{
  isDefinedBy: CryptoDetails[];
  prefLabel: string[];
  description: string[];
}
