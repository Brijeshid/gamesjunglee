import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesRegulationsComponent } from './components/rules-regulations/rules-regulations.component';
import { UserSettingsMainComponent } from './components/user-settings-main/user-settings-main.component';

const routes: Routes = [{
  path:'',
  component:UserSettingsMainComponent,
  children:[
    {path:'rules-regulations', component:RulesRegulationsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
