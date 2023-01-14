import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterOutlet} from "@angular/router";
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './shared/navbar/navbar.component';
import {MenubarModule} from "primeng/menubar";
import {InputTextModule} from "primeng/inputtext";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {CryptoBrowserModule} from "./crypto-browser/crypto-browser.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    MenubarModule,
    InputTextModule,
    ToastModule,
    CryptoBrowserModule,
    BrowserAnimationsModule
  ],
  providers: [
    MessageService,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
