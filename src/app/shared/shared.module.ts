import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { BetSlipComponent } from './components/bet-slip/bet-slip.component';

@NgModule({
  declarations: [
    HeaderComponent,
    RightSidebarComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent
  ]
})
export class SharedModule { }
