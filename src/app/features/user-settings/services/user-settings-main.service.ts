import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsMainService {
  private currentBet:any = {};
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

  _getTransferStatementApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getTransferStatementEndPoint());
  }
  _getUserConfigApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserConfigEndPoint());
  }

  _getSaveUserConfigApi(saveUserConfig: object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSaveUserConfigEndPoint(),saveUserConfig);
  }

  _getUserBets() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserBets());
  }

  _getProfitLossApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getProfitLoss());
  }


    getPlBets(){
        console.log('pnl2',this.currentBet)
        return this.currentBet;
    }

    setPlBets(currentBet:any){
        this.currentBet =currentBet;
        console.log('pnl3',currentBet)

    }

}
