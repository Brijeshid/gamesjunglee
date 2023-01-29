import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SPINNER,
  NgxUiLoaderModule,
  NgxUiLoaderConfig
} from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'blue',
  // bgsOpacity: 0.5,
  // bgsPosition: POSITION.bottomLeft,
  bgsSize: 60,
  bgsType: SPINNER.foldingCube,
  blur: 50,
  // delay: 0,
  fastFadeOut: true,
  fgsColor: 'blue',
  // fgsPosition: POSITION.centerCenter,
  fgsSize: 60,
  fgsType: SPINNER.foldingCube,
  // gap: 24,
  // logoPosition: POSITION.centerCenter,
  // logoSize: 120,
  // logoUrl: 'assets/angular.png',
  // overlayBorderRadius: '0',
  // overlayColor: 'rgba(40, 40, 40, 0.8)',
  pbColor: 'blue'
  // pbDirection: PB_DIRECTION.leftToRight,
  // pbThickness: 5,
  // hasProgressBar: false,
  // text: 'Welcome to ngx-ui-loader',
  // textColor: '#FFFFFF',
  // textPosition: POSITION.centerCenter,
  // maxTime: -1,
  // minTime: 500
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    //loader
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  exports:[
    NgxUiLoaderModule
  ]
})
export class LoaderModule { }
