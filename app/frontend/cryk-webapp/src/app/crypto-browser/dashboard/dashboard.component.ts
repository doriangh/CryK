import {Component, OnInit} from '@angular/core';
import {DashboardService} from "./dashboard.service";
import {Coin} from "../../models/coin";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  coins: Coin[] = [];
  displayedColumns: string[] = ['rank', 'name', 'symbol', 'price_usd', 'price_btc'];

  chartData: any;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.dashboardService.getCoins().subscribe({
      next: value => {
        console.log(value);

        this.coins = value;
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

}
