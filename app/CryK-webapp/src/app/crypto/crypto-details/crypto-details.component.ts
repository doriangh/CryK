import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Chart, Colors, registerables} from "chart.js";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from "ng-apexcharts";
import {CryptoService} from "../services/crypto.service";
import {PriceHistory} from "../../models/price-history";
import {FilterInterval} from "../../models/filter-interval";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {interval, Subscription} from "rxjs";
import {ExchangeData} from "../../models/exchange-data";
import {GlobalConstants} from "../../shared/global-constants";
import {JsonLdService} from "ngx-seo";


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

Chart.register(Colors, ...registerables);

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss']
})
export class CryptoDetailsComponent implements OnInit, OnDestroy {

  get currentPrice(): ExchangeData {
    return this._currentPrice;
  }
  set currentPrice(value: ExchangeData) {
    this.isPriceUp = +value.price > +this._currentPrice?.price;
    this._currentPrice = value;
  }
  @ViewChild('lineChart', {static: true}) lineChart: ChartComponent;
  @ViewChild('candlestickChart', {static: true}) candlestickChart: ChartComponent;
  public lineChartOptions: Partial<ChartOptions> | any;
  public candlestickChartOptions: Partial<ChartOptions> | any;
  public activeOptionButton = '1w';

  private pricePoll: Subscription;
  availablePairs: string[] = GlobalConstants.exchangeCoinList;
  selectedPair: string = 'USDT';
  coinPriceHistory: PriceHistory;
  isCandlestick: boolean;
  coinId: string | undefined;
  cryptocurrency: Cryptocurrency;
  private _currentPrice: ExchangeData;
  isPriceUp: boolean;
  dateNow: Date = new Date();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private cryptoService: CryptoService,
              private jsonLdService: JsonLdService) {  }

  ngOnDestroy(): void {
    this.pricePoll.unsubscribe();
  }

  ngOnInit(): void {

    this.coinId = this.route.snapshot.paramMap.get('coinId')?.toUpperCase();

    this.getChartData(FilterInterval.ONE_WEEK);

    this.cryptoService.getCoinDetails(this.coinId!).subscribe({
      next: value => {
        console.log(value);

        this.jsonLdService.setData(this.jsonLdService.getObject('CryptoCurrency', value));



        if (value === undefined){
          this.router.navigate(['/notfound']);
        }

        this.cryptocurrency = value;
        this.currentPrice = {
            price: value.price[0].value.toString(),
            symbol: this.selectedPair,
        };
      }
    });

    this.cryptoService.getCoinExchangeData([this.coinId!], this.selectedPair).subscribe({
      next: value => {
        this.currentPrice = value.exchangeData[0];
      }
    });

    this.pricePoll = interval(10000).subscribe(() => {

      this.cryptoService.getCoinExchangeData([this.coinId!], this.selectedPair).subscribe({
        next: value => {
          this.currentPrice = value.exchangeData[0];
          this.dateNow = new Date();
        }
      });

    });
  }

  getChartData(filterInterval: FilterInterval){
    this.cryptoService.getCoinPriceHistory(this.coinId!.toString(), filterInterval).subscribe({
      next: value => {
        this.coinPriceHistory = value;
        this.displayChart();
        console.log(value);
      }
    });

  }

  displayChart() {

    if (this.coinPriceHistory === undefined){
      return;
    }

    let newData = this.coinPriceHistory.kline.map((obj, index) =>
      ({
        x: this.coinPriceHistory.dates[index],
        y: [obj.openPrice, obj.highPrice, obj.lowPrice, obj.closePrice]
      }));

    this.candlestickChartOptions = {
      chart: {
        height: 350,
        type: 'candlestick',
        width: '100%',
        zoom: {
          autoScaleYaxis: true
        }
      },
      series: [
        {
          name: 'Candlestick Price',
          data: newData,
        }
      ],
      xaxis: {
        type: 'datetime',
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      dataLabels: {
        enabled: false
      },
      noData: {
        text: 'No Data Available'
      }
    };

    this.lineChartOptions = {
      chart: {
        height: 350,
        type: 'area',
        width: '100%',
        zoom: {
          autoScaleYaxis: true
        }
      },
      series: [
        {
          name: 'Line Price',
          data: this.coinPriceHistory.prices,
        }
      ],
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        categories: this.coinPriceHistory.dates,
        tickAmount: 6
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      dataLabels: {
        enabled: false
      },
      noData: {
        text: 'No Data Available'
      }
    };
  }

  public updateOptions(option: any): void {
    this.activeOptionButton = option;
    this.getChartData(option as FilterInterval);
  }

  public updateChartType(type: any): void {
    this.isCandlestick = type === 'candlestick';
  }

  fallbackImage($event: any) {
    $event.target.src = `https://coinicons-api.vercel.app/api/icon/${this.coinId?.toLowerCase()}`;
  }

  updateExchangePrice() {
    this.cryptoService.getCoinExchangeData([this.coinId!], this.selectedPair).subscribe({
      next: value => {
        this.currentPrice = value.exchangeData[0];
      }
    });
  }
}
