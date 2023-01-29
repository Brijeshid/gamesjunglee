import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsBookMainComponent } from './components/sports-book-main/sports-book-main.component';

const routes: Routes = [
  {
    path:'',
    component: SportsBookMainComponent,
    children:[
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SportsBookRoutingModule { }
