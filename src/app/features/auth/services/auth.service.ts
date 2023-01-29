import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
  ) { }

  _postLoginApi(loginBody: object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLoginEndpoint(), loginBody);
  } 

  _postSignupApi(SignupBody: object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSignupEndpoint(), SignupBody);
  } 
}
