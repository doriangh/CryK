import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./crypto-browser/dashboard/dashboard.component";
import {DetailsComponent} from "./crypto-browser/details/details.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'details', component: DetailsComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
