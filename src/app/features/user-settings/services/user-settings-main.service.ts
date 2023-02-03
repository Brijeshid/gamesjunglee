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
  
  _postChangePasswordApi(ChangePasswordBody: object){
    return this._apiHttpService
    .post(this._apiEndpointsService.getChangePasswordEndpoin(),ChangePasswordBody);
  }


}
