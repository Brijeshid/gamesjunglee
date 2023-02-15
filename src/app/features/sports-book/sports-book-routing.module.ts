import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsMarketListComponent } from './components/sports-market-list/sports-market-list.component';
import { SportsBookMainComponent } from './components/sports-book-main/sports-book-main.component';
import { TourMarketListComponent } from './components/tour-market-list/tour-market-list.component';
import { MatchMarketListComponent } from './components/match-market-list/match-market-list.component';

const routes: Routes = [
  {
    path:'',
    component: SportsBookMainComponent,
    children:[
      {path:'sportsbook/:sports/:tourId/:matchId',component:MatchMarketListComponent},
      {path:'sportsbook/:sports/:tourId',component:TourMarketListComponent},
      {path:'sportsbook/:sports',component:SportsMarketListComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportsBookRoutingModule { }
