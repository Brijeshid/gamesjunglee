import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsMainService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
  ) { }


  _getTermCondApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getTermCondEndPoint());
  }
  _getTransferStatementApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getTransferStatementEndPoint());
  }
  _getUserConfigApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserConfigEndPoint());
  }

}
