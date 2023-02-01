import {Component, OnInit, ViewChild} from '@angular/core';
import {CryptoService} from "../services/crypto.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-crypto-browser',
  templateUrl: './crypto-browser.component.html',
  styleUrls: ['./crypto-browser.component.scss']
})
export class CryptoBrowserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  selectedCoin: any = null;
  coins: MatTableDataSource<Cryptocurrency>;
  filteredCoins: any[] = [];
  displayedColumns: string[] = ['symbol', 'prefLabel', 'value'];

  constructor(
    private httpClient: HttpClient,
    private dashboardService: CryptoService) {
  }

  async ngOnInit(): Promise<void>{
    this.dashboardService.getCryptoCoins().subscribe({
      next: (value: Cryptocurrency[]) => {
        console.log(value);

       value = value.filter(coin => {
          return coin.symbol && coin.prefLabel.length > 0 && !['D', 'REV', 'BTSX', 'BTD', 'XXC', 'XBV', 'BXBC', 'CREVA', 'VC', 'PCM', 'ZMC', 'PHP', 'STEEM', 'FXN', 'WMC', 'TCR', 'DISK', 'ZEC', 'BILL', 'FRN', 'XAV', 'HTC', 'GBYTE', 'IPAY', 'LMC', 'POST', 'BCF', 'DUI', 'TXB', 'ACR', 'SHT', 'KR', 'UNF', 'VMINE', 'CAB', 'GBIT', 'ION', 'ETC', 'DXC', 'XVG', 'XMN', 'CUC', 'FOOT', 'DBIC', 'PEX', 'BULL', 'MEME', 'NPT', 'ANS', 'STRAT', 'DEUR2', 'LION', 'ASC', 'XNG', 'BAI', 'WWW', 'PSC', 'KLC', 'ELCO', 'LSK', 'NUC', 'MOOND', 'CORG', 'XHI', 'XLM', 'XVC', 'ENE', 'JACK', 'EDR', 'EDS', 'GOLOS', 'XCT', 'BIGUP', 'NKC', 'TDC', 'VITAL', 'MOJO', 'EDRC', 'YCC', 'SAR', 'N7', 'RXC', 'GAME', 'GBT', 'KONG', 'WAVES', 'VEC', 'ICASH', 'SHF', 'LION2', 'ASCE']
            .includes(coin.symbol[0]);
      });

        this.coins = new MatTableDataSource( value );
        this.coins.paginator = this.paginator;
        this.coins.sort = this.sort;
      }
    });

  }

  filterCoins(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.coins.data.length; i++) {
      let coin = this.coins.data[i];
      if (coin.prefLabel[0] && coin.prefLabel[0].toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(coin);
      }
    }


    this.coins.filter = query.trim().toLowerCase();
    this.filteredCoins = filtered;
  }

  fallbackImage($event: any, coinId: string) {
    $event.target.src = `https://coinicons-api.vercel.app/api/icon/${coinId?.toLowerCase()}`;
  }

}
