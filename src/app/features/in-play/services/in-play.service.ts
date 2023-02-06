import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class InPlayService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
  ) { }
  
  getMarketDataByEventIdApi(id:string| null) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getMarketByEventIdEndpoint(id));
  }

  
}
