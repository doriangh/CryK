import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {MenubarModule} from "primeng/menubar";
import {AutoCompleteModule} from "primeng/autocomplete";
import {MatInputModule} from "@angular/material/input";
import { FooterComponent } from './footer/footer.component';
import { NotfoundComponent } from './notfound/notfound.component';
import {MdbCollapseModule} from "mdb-angular-ui-kit/collapse";

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
    MatInputModule,
    MdbCollapseModule
  ]
})
export class SharedModule { }
