import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsMainComponent } from './components/user-settings-main/user-settings-main.component';
import { RulesRegulationsComponent } from './components/rules-regulations/rules-regulations.component';
import { SharedModule } from '@shared/shared.module';
import { NewsComponent } from './components/news/news.component';


@NgModule({
  declarations: [
    UserSettingsMainComponent,
    RulesRegulationsComponent,
    NewsComponent
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    SharedModule
  ]
})
export class UserSettingsModule { }
