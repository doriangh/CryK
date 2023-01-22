import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-crypto-details',
  templateUrl: './crypto-details.component.html',
  styleUrls: ['./crypto-details.component.scss']
})
export class CryptoDetailsComponent implements OnInit {

  coinId: string | null = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.coinId = this.route.snapshot.paramMap.get('coinId')
  }

}
