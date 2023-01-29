import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { FavouriteComponent } from './components/favourite/favourite.component';

@NgModule({
  declarations: [
    HeaderComponent,
    RightSidebarComponent,
    FavouriteComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FavouriteComponent
  ]
})
export class SharedModule { }
