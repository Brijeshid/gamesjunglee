import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsBookIndexComponent } from './components/sports-book-index/sports-book-index.component';
import { SportsBookMainComponent } from './components/sports-book-main/sports-book-main.component';

const routes: Routes = [
  {
    path:'',
    component: SportsBookMainComponent,
    children:[
      {path:'sportsbook/:sports',component:SportsBookIndexComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportsBookRoutingModule { }
