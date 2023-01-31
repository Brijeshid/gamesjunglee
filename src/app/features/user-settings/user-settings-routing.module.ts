import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BettingPlComponent } from './components/betting-pl/betting-pl.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { NewsComponent } from './components/news/news.component';
import { OpenBetsComponent } from './components/open-bets/open-bets.component';
import { RulesRegulationsComponent } from './components/rules-regulations/rules-regulations.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TimeSettingsComponent } from './components/time-settings/time-settings.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { UserSettingsMainComponent } from './components/user-settings-main/user-settings-main.component';

const routes: Routes = [{
  path:'',
  component:UserSettingsMainComponent,
  children:[
    {path:'favorites',component:FavouriteComponent},
    {path:'bets',component:OpenBetsComponent},
    {path:'profit-loss',component:BettingPlComponent},
    {path:'transfer-statements',component:TransferStatementComponent},
    {path:'time-settings',component:TimeSettingsComponent},
    {path:'news',component:NewsComponent},
    {path:'change-password',component:ChangePasswordComponent},
    {path:'rules-regulations', component:RulesRegulationsComponent},
    {path:'settings', component:SettingsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
