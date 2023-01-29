import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportsBookRoutingModule } from './sports-book-routing.module';
import { SportsBookMainComponent } from './components/sports-book-main/sports-book-main.component';
import { SportsBookIndexComponent } from './components/sports-book-index/sports-book-index.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    SportsBookMainComponent,
    SportsBookIndexComponent
  ],
  imports: [
    CommonModule,
    SportsBookRoutingModule,
    SharedModule
  ]
})
export class SportsBookModule { }
