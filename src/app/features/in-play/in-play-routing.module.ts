import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InPlayIndexComponent } from './components/in-play-index/in-play-index.component';
import { InPlayMainComponent } from './components/in-play-main/in-play-main.component';

const routes: Routes = [
  {
    path:'',
    component:InPlayMainComponent,
    children:[
      {path:'in-play', component:InPlayIndexComponent},
      {path:'', redirectTo:'/in-play', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InPlayRoutingModule { }
