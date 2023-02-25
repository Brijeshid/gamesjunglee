import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { BetSlipComponent } from './components/bet-slip/bet-slip.component';
import { MarketRateFormaterPipe } from './pipes/market-rate-formater.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    RightSidebarComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent,
    MarketRateFormaterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent,
    MarketRateFormaterPipe
  ]
})
export class SharedModule { }
