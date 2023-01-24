import {Component, Input, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {Cryptocurrency} from "../../models/cryptocurrency";
import {CryptoService} from "../../crypto/crypto.service";
import {Router} from "@angular/router";

@Component({
  selector: 'cryk-header',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string = '';

  myControl = new FormControl();
  timeout: any = null;
  isLoading: boolean;

  items: MenuItem[] = [];
  activeItem: MenuItem;

  options: string[];
  filteredOptions: Observable<string[]>;
  coins: Cryptocurrency[];

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {

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

    this.activeItem = this.items[0];
  }

  beginTypeSearch(event: any) {
    this.isLoading = true;
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.typeSearch(event.target.value);
      }
    }, 1000);
  }

  typeSearch(value: string) {
    console.log(value);

    this.isLoading = false;
  }

  optionSelected(coin: any) {
    this.router.navigate(['/details', coin.id])
      .then(r => {
        this.myControl.setValue('');
        this.options = [];
      });
  }

  activateMenu($event: MouseEvent) {

  }
}
