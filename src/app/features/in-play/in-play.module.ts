import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InPlayRoutingModule } from './in-play-routing.module';
import { InPlayMainComponent } from './components/in-play-main/in-play-main.component';
import { InPlayIndexComponent } from './components/in-play-index/in-play-index.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    InPlayMainComponent,
    InPlayIndexComponent,
    LeftNavComponent,
  ],
  imports: [
    CommonModule,
    InPlayRoutingModule,
    SharedModule
  ]
})
export class InPlayModule { }
