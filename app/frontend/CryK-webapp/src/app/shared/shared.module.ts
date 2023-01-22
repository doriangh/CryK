import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {MenubarModule} from "primeng/menubar";
import {AutoCompleteModule} from "primeng/autocomplete";
import {MatInputModule} from "@angular/material/input";
import { FooterComponent } from './footer/footer.component';
import { NotfoundComponent } from './notfound/notfound.component';



@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NotfoundComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    AutoCompleteModule,
    MatInputModule
  ]
})
export class SharedModule { }
