import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class SportsBookService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
  ) { }

  _postBookMakerMarketApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBookMakerEndPoint(), inPlayUpcomingBody);
  }

  _postFancyMarketApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getFancyMarketEndPoint(), inPlayUpcomingBody);
  }

}
