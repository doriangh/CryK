import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import {TableModule} from "primeng/table";
import {HttpClientModule} from "@angular/common/http";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {ChartModule} from "primeng/chart";
import {MatGridListModule} from "@angular/material/grid-list";



@NgModule({
  declarations: [
    DashboardComponent,
    DetailsComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    TableModule,
    MatCardModule,
    MatTableModule,
    ChartModule,
    MatGridListModule
  ]
})
export class CryptoBrowserModule { }
