import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CryptoBrowserComponent } from './crypto/crypto-browser/crypto-browser.component';
import { CryptoDashComponent } from './crypto/crypto-dash/crypto-dash.component';
import { CryptoDetailsComponent } from './crypto/crypto-details/crypto-details.component';
import {NotfoundComponent} from "./shared/notfound/notfound.component";

const routes: Routes = [
  {path: '', component: CryptoDashComponent},
  {path: 'details/:coinId', component: CryptoDetailsComponent},
  {path: 'browse', component: CryptoBrowserComponent},
  {path: 'notfound', component: NotfoundComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
