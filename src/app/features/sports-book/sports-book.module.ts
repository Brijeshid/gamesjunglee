import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SportsBookRoutingModule } from './sports-book-routing.module';
import { SportsBookMainComponent } from './components/sports-book-main/sports-book-main.component';
import { SportsMarketListComponent } from './components/sports-market-list/sports-market-list.component';
import { SharedModule } from '@shared/shared.module';
import { LeaguesComponent } from './components/leagues/leagues.component';
import { ResultsComponent } from './components/results/results.component';
import { TourMarketListComponent } from './components/tour-market-list/tour-market-list.component';
import { MatchMarketListComponent } from './components/match-market-list/match-market-list.component';


@NgModule({
  declarations: [
    SportsBookMainComponent,
    SportsMarketListComponent,
    LeaguesComponent,
    ResultsComponent,
    TourMarketListComponent,
    MatchMarketListComponent
  ],
  imports: [
    CommonModule,
    SportsBookRoutingModule,
    SharedModule
  ]
})
export class SportsBookModule { }
