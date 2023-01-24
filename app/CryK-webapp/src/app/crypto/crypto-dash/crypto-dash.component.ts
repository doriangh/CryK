import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ChartConfiguration, ChartOptions} from "chart.js";
import {CryptoService} from "../crypto.service";
import {Cryptocurrency} from "../../models/cryptocurrency";

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

  headerIsAboveContent: boolean;

  columns = ["expand", "rank", "name", "symbol", "price_usd", "price_btc"];

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Price Variation',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: true,
        tension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#4bc0c0',
      }
    ]
  }

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  isChartVisible = false;
  chartState = 'hidden';

  coins: Cryptocurrency[] = [];
  // @ts-ignore
  expandedElement: Cryptocurrency | null;

  chartData: any;
  private selectedCoin: any;

  constructor(
    private dashboardService: CryptoService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.dashboardService.getCoins().subscribe({
      next: value => {
        console.log(value);
        this.coins = value;

        value.forEach(coin => {
          coin.icon = "./assets/cryptocurrency-icons/" + coin.symbol.toLowerCase() + ".svg";
        });
      }
    });

    this.chartData = {
      datasets:[
        {
          label: 'Price Fluctuation',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          fill: false,
          borderColor: '#4bc0c0',
          tension: 0.1
        }
      ]
    }
  }

  ngAfterViewInit() {
    window.addEventListener("scroll", () => {
      this.checkPosition();
    });

    window.addEventListener("resize", () => {
      this.checkPosition();
    });
  }

  checkPosition() {
    const headerRect = this.header.nativeElement.getBoundingClientRect();
    const contentRect = this.content.nativeElement.getBoundingClientRect();

    this.headerIsAboveContent = headerRect.bottom > contentRect.top;
  }
}
