import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'cryk-header',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{

  items: MenuItem[] = [];

  ngOnInit() {
this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        label: 'Browse',
        icon: 'pi pi-fw pi-globe',
        routerLink: '/browse'
      }
    ]
  }
}
