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
}
