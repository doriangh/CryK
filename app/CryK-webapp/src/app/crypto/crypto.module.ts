import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoDetailsComponent } from './crypto-details/crypto-details.component';
import { CryptoDashComponent } from './crypto-dash/crypto-dash.component';
import { CryptoBrowserComponent } from './crypto-browser/crypto-browser.component';
import {AutoCompleteModule} from "primeng/autocomplete";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ChartModule} from "primeng/chart";
import {NgChartsModule} from "ng2-charts";
import {RouterLink} from "@angular/router";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ProgressBarModule} from "primeng/progressbar";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SpinnerModule} from "primeng/spinner";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";



@NgModule({
  declarations: [
    CryptoDetailsComponent,
    CryptoDashComponent,
    CryptoBrowserComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    TableModule,
    MatCardModule,
    MatTableModule,
    ChartModule,
    MatGridListModule,
    ButtonModule,
    RippleModule,
    NgChartsModule,
    CardModule,
    InputTextModule,
    AutoCompleteModule,
    MatAutocompleteModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    ProgressBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ProgressSpinnerModule,
    SpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ]
})
export class CryptoModule { }
