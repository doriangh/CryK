import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {FormControl} from "@angular/forms";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {CryptoService} from "../../crypto/services/crypto.service";
import {Router} from "@angular/router";

@Component({
  selector: 'cryk-header',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string = '';

  myControl = new FormControl();
  items: MenuItem[] = [];
  activeItem: MenuItem;

  options: string[];
  filteredOptions: string[];
  coins: Cryptocurrency[];

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home']},
      {label: 'browse', icon: 'pi pi-fw pi-globe', routerLink: ['/browse']}
    ]

    this.myControl.valueChanges.subscribe(value => {
      if (value == '')
        this.options = [];
    });

    this.cryptoService.getCryptoCoins().subscribe({
      next: value => {
        this.coins = value;
      }
    });

    this.activeItem = this.items[0];
  }

  beginTypeSearch(event: any) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < this.coins.length; i++) {
      let coin = this.coins[i];
      if ((coin.symbol[0]?.toLowerCase().indexOf(query.toLowerCase()) == 0)) {
        filtered.push(coin.symbol[0]);
      }
    }

    this.filteredOptions = filtered;

  }
  optionSelected(event: any) {
    this.router.navigate(['/details/', event]);
  }
}
