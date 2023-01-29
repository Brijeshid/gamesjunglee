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

  _postInPlayUpcomingApi(inPlayUpcomingBody: object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getInPlayUpcomingEndPoint(), inPlayUpcomingBody);
  }
  
  getMarketDataByEventIdApi(id:string| null) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getMarketByEventIdEndpoint(id));
  }

  getWebSocketURLApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getWebSocketURLEndpoint());
  }

  postSetOrUnsetWebSocketDataApi(isSet:boolean,objParams:object) {
    if(isSet){
      return this._apiHttpService
      .post(this._apiEndpointsService.getWebSocketDataBySetORUnsetEndpoint('set'), objParams);
    }else{
      return this._apiHttpService
      .post(this._apiEndpointsService.getWebSocketDataBySetORUnsetEndpoint('unset'), objParams);
    }
  }
}
