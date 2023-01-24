import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CryptoService} from "../crypto.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {Event} from "@angular/router";

@Component({
  selector: 'app-crypto-browser',
  templateUrl: './crypto-browser.component.html',
  styleUrls: ['./crypto-browser.component.scss']
})
export class CryptoBrowserComponent implements OnInit{
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  selectedCoin: any = null;
  // @ts-ignore
  coins: MatTableDataSource<Cryptocurrency>;
  filteredCoins: any[] = [];
  displayedColumns: string[] = ['rank', 'name', 'symbol', 'price_usd', 'price_btc'];

  constructor(
    private dashboardService: CryptoService) {
  }

  ngOnInit(): void {
    this.dashboardService.getCoins().subscribe(coins => {

      coins.forEach(coin => {
        coin.icon = "./assets/cryptocurrency-icons/" + coin.symbol.toLowerCase() + ".svg";
      });

      this.coins = new MatTableDataSource(coins);
      this.coins.paginator = this.paginator;
      this.coins.sort = this.sort;
      // this.filteredCoins = coins;
    });
  }

  applyFilter(filterValue: KeyboardEvent){
    // @ts-ignore
    let value = filterValue.target.value;
    this.coins.filter = value.trim().toLowerCase();
  }

  // @ts-ignore
  filterCoins(event){
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.coins.data.length; i++) {
      let coin = this.coins.data[i];
      if (coin.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(coin);
      }
    }

    this.filteredCoins = filtered;
  }

}
