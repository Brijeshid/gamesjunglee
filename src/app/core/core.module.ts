import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiEndpointsService } from './services/api-endpoint.service';
import { ApiHttpService } from './services/api-http.service';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  providers:[
    ApiEndpointsService,
    ApiHttpService
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class CoreModule { }
