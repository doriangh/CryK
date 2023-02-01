import {PoWScheme} from "./po-wscheme";
import {PosScheme} from "./pos-scheme";
import {DistributionScheme} from "./distribution-scheme";
import {Protocol} from "./protocol";
import {ProtectionScheme} from "./protection-scheme";
import {Price} from "./price";
import {CryptoDetails} from "./crypto-details";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers, ApexStroke,
  ApexTitleSubtitle, ApexTooltip, ApexXAxis,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
}

export interface Cryptocurrency extends CryptoDetails{
  symbol: string[];
  totalCoins: string[];
  prefLabel: string[];
  pow: PoWScheme[];
  pos: PosScheme[];
  website: string[];
  description: string[];
  image: string[];
  distributionScheme: DistributionScheme[];
  comment: string[];
  incept: string[];
  blockTime: string[];
  maturation: string[];
  source: string[];
  protocol: Protocol[];
  confirmations: string[];
  blockReward: string[];
  dateFounded: string[];
  cloneOf: Cryptocurrency[];
  rewardModifier: string[];
  retargetTime: string[];
  premine: string[];
  protectionScheme: ProtectionScheme[];
  price: Price[];
  updatedAt: string[];

  //Local properties
  lineChartOptions: Partial<ChartOptions> | any;
  price_usdt: number;
  price_other: number;

}
