import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InPlayRoutingModule } from './in-play-routing.module';
import { InPlayMainComponent } from './components/in-play-main/in-play-main.component';
import { InPlayIndexComponent } from './components/in-play-index/in-play-index.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    InPlayMainComponent,
    InPlayIndexComponent
  ],
  imports: [
    CommonModule,
    InPlayRoutingModule,
    SharedModule
  ]
})
export class InPlayModule { }
