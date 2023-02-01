import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CryptoService} from "../services/crypto.service";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {ExchangeDataResponse} from "../../models/exchange-data-response";
import {FilterInterval} from "../../models/filter-interval";
import {GlobalConstants} from "../../shared/global-constants";


@Component({
  selector: 'app-crypto-dash',
  templateUrl: './crypto-dash.component.html',
  styleUrls: ['./crypto-dash.component.scss'],
  animations: [
    trigger('rowSelect', [
      state('selected', style({
        transform: 'translateX(-100%)'
      })),
      state('unselected', style({
        transform: 'none'
      })),
      transition('unselected => selected', animate('300ms ease-in')),
      transition('selected => unselected', animate('300ms ease-out'))
    ]),
    trigger('chartContainer', [
      state('shown', style({
        transform: 'translateX(0)'
      })),
      state('hidden', style({
        transform: 'translateX(100%)'
      })),
      transition('hidden => shown', animate('300ms ease-in')),
      transition('shown => hidden', animate('300ms ease-out'))
    ]),
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class CryptoDashComponent implements OnInit, AfterViewInit {
  @ViewChild('header', {static: false}) header: ElementRef;
  @ViewChild('content', {static: false}) content: ElementRef;
  exchangeData: ExchangeDataResponse;

  headerIsAboveContent: boolean;

  columns = ["expand", "name", "symbol", "price_usdt", "price_other"];
  selectedPair = 'BTC';
  coins: Cryptocurrency[] = [];
  expandedElement: Cryptocurrency | null;
  constructor(
    private dashboardService: CryptoService
  ) {
  }

  ngOnInit(): void {
    this.dashboardService.getCoinExchangeData(["BTC", "ETH"], "USDT").subscribe({
      next: value => {
        console.log(value);
      }
    });

    this.dashboardService.getTopCryptoCoins().subscribe({
      next: value => {
        console.log(value);
        this.coins = value;

        this.coins.forEach(coin => {
          //get coin exchange data and setup chart
          this.dashboardService.getCoinPriceHistory(coin.symbol[0],FilterInterval.THIRTY_MINUTES).subscribe({
            next: value => {
              coin.lineChartOptions = {
                series: [
                  {
                    name: 'Line Price',
                    data: value.prices,
                  }
                ],
                chart: {
                  height: 500,
                  type: 'area',
                  width: '100%',
                  zoom: {
                    autoScaleYaxis: true
                  }
                },
                stroke: {
                  curve: 'smooth',
                  width: 2
                },
                xaxis: {
                  type: 'datetime',
                  categories: value.dates,
                  tickAmount: 6
                },
                tooltip: {
                  x: {
                    format: 'dd MMM yyyy'
                  }
                },
                dataLabels: {
                  enabled: false
                }
              }
            }
          });
        });

        this.coins.forEach(coin => {
          this.dashboardService.getCoinExchangeData([coin.symbol[0]], "USDT").subscribe({
            next: value => {
              console.log(value);
              coin.price_usdt = Number(value.exchangeData[0].price);
            }
          });
        });

        this.coins.forEach(coin => {
          this.dashboardService.getCoinExchangeData([coin.symbol[0]], this.selectedPair).subscribe({
            next: value => {
              console.log(value);
              coin.price_other = Number(value.exchangeData[0].price);
            }
          });
        });
      }
    });
  }

  ngAfterViewInit() {
    this.coins.forEach(coin => {
      this.dashboardService.getCoinExchangeData([coin.symbol[0]], this.selectedPair).subscribe({
        next: value => {
          console.log(value);
          coin.price_usdt = Number(value.exchangeData[0].price);
        }
      });
    });
  }
}
