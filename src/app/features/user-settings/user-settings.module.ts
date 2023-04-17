import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsMainComponent } from './components/user-settings-main/user-settings-main.component';
import { RulesRegulationsComponent } from './components/rules-regulations/rules-regulations.component';
import { SharedModule } from '@shared/shared.module';
import { NewsComponent } from './components/news/news.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { OpenBetsComponent } from './components/open-bets/open-bets.component';
import { BettingPlComponent } from './components/betting-pl/betting-pl.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { TimeSettingsComponent } from './components/time-settings/time-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchNamePlComponent } from './components/match-name-pl/match-name-pl.component';
import { NgxDateRangeModule } from 'ngx-daterange';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { BetHistoryComponent } from './components/bet-history/bet-history.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';


@NgModule({
  declarations: [
    UserSettingsMainComponent,
    RulesRegulationsComponent,
    NewsComponent,
    FavouriteComponent,
    OpenBetsComponent,
    BettingPlComponent,
    TransferStatementComponent,
    TimeSettingsComponent,
    ChangePasswordComponent,
    SettingsComponent,
    MatchNamePlComponent,
    AccountStatementComponent,
    BetHistoryComponent,
    ProfitLossComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDateRangeModule,

  ]
})
export class UserSettingsModule { }
