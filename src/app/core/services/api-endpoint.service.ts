// Angular Modules
import { Injectable } from '@angular/core';
// Application Classes
import { UrlBuilder } from '@shared/models/url-builder';
import { QueryStringParameters } from '@shared/models/query-string-parameters';

// Application Constants
import { Constants } from '@config/constant';

@Injectable()
export class ApiEndpointsService {
  constructor(
    // Application Constants
    private _constants: Constants
  ) { }
  /* #region URL CREATOR */
  // URL
  private createUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        this._constants.API_ENDPOINT,
      action
    );
    return urlBuilder.toString();
  }
  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH QUERY PARAMS
  private createUrlWithQueryParametersExclude(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }

  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(
    action: string,
    pathVariables: any[] = []
  ): string {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl +=
          `/${encodeURIComponent(pathVariable.toString())}`;
      }
    }
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      `${action}${encodedPathVariablesUrl}`
    );
    return urlBuilder.toString();
  }
  /* #endregion */


  //Example

  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news');
  //   }

  //   This method will return:
  //    https://domain.com/api/news


  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news', true);
  //   }

  //   This method will return:
  //   https://mock-domain.com/api/news


  //   public getProductListByCountryAndPostalCodeEndpoint(
  //     countryCode: string,
  //     postalCode: string
  //   ): string {
  //     return this.createUrlWithQueryParameters(
  //       'productlist',
  //       (qs: QueryStringParameters) => {
  //         qs.push('countryCode', countryCode);
  //         qs.push('postalCode', postalCode);
  //       }
  //     );
  //   }

  //   This method will return:
  //   https://domain.com/api/productlist?countrycode=en&postalcode=12345


  //   public getDataByIdAndCodeEndpoint(
  //     id: string,
  //     code: number
  //   ): string {
  //     return this.createUrlWithPathVariables('data', [id, code]);
  //   }

  //   This method will return:
  //   https://domain.com/api/data/12/67


  // Now, let’s go to a component and use them all together.

  // constructor(
  //   // Application Services
  //   private apiHttpService: ApiHttpService,
  //   private apiEndpointsService: ApiEndpointsService
  // ) {
  //     ngOnInit() {
  //     this.apiHttpService
  //       .get(this.apiEndpointsService.getNewsEndpoint())
  //       .subscribe(() => {
  //         console.log('News loaded'))
  //       });
  // }

  public getLoginEndpoint(): string {
    return this.createUrl(this._constants.API_URL_LOGIN);
  }

  // create Akash
  public getSignupEndpoint(): string {
    // return this._constants.API_URL_SIGNUP;
    return this.createUrl(this._constants.API_URL_SIGNUP);
  }

  public getChangePasswordEndpoin(): string {
    return this.createUrl(this._constants.API_URL_CHANGEPASSWORD);
  }
  public getSportBetEndpoint(): string {
    return this.createUrl(this._constants.API_URL_SPORTSBET);
  }
  public getAccountStatementEndpoint(): string {
    return this.createUrl(this._constants.API_URL_ACCOUNTSTATEMENT);
  }
  public getClientDataEndpoint(): string {
    return this.createUrl(this._constants.API_URL_CLIENTDATA);
  }
  public getClientDataSaveEndpoint(): string {
    return this.createUrl(this._constants.API_URL_SIGNUP);
  }
  public getUpadateClientDataEndpoint(): string {
    return this.createUrl(this._constants.API_URL_UPDATECLIENTDATA);
  }
  public deleteClientDataEndpoint(id:number): string {
    return this.createUrl(this._constants.API_URL_DELETECLIENTDATA+'/'+id);
  }
  public getDeviceLogsEndpoint(): string {
    return this.createUrl(this._constants.API_URL_DEVICELOGS);
  }
  public getSignUpListEndpoint(): string {
    return this.createUrl(this._constants.API_URL_SIGNUPLIST);
  }
  public getAddUsersEndpoint(): string {
    return this.createUrl(this._constants.API_URL_ADDUSERS);
  }

  public getSportsEndpoint(): string {
    return this.createUrl(this._constants.API_URL_SPORTS);
  }

  public getRolesEndpoint(): string {
    return this.createUrl(this._constants.API_URL_ROLES)
  }

  public getSportsToursEndpoint(): string {
    return this.createUrl(this._constants.API_URL_SPORTS_TOUR)
  }

  public getSportsToursByIdEndpoint(
    id: string
  ): string {
    return this.createUrlWithPathVariables(this._constants.API_URL_SPORTS_TOURNAMENT, [id]);
  }

  public getToursMatchesByIdEndpoint(
    id: string
  ): string {
    return this.createUrlWithPathVariables(this._constants.API_URL_TOURNAMENT_MATCHES, [id]);
  }

  public getMarketByEventIdEndpoint(
    id: string | null
  ): string {
    return this.createUrlWithPathVariables(this._constants.API_URL_MATCHES, [id]);
  }


  public getUserDetailEndpoint(): string {
    return this.createUrl(this._constants.API_URL_USER_DETAIL);
  }

  public getTermConditionEndpoint(): string {
    return this.createUrl(this._constants.API_URL_TERM_CONDITION);
  }

  public postAddBankDetails(): string {
    return this.createUrl(this._constants.API_URL_ADD_BANK_DETAILS);
  }
  public postUpdateBankDetails(): string {
    return this.createUrl(this._constants.API_URL_UPDATE_BANK_DETAILS);
  }
  public deleteBankDetails(Id:number): string {
    return this.createUrl(this._constants.API_URL_DELETE_BANK_DETAILS+'/'+Id);
  }
  public getWithdrawDepositHistory(): string {
    return this.createUrl(this._constants.API_URL_DEPOSIT_WITHDRAW_HISTORY);
  }

  public getBankDetails(): string {
    return this.createUrl(this._constants.API_URL_GET_BANK_DETAILS);
  }

  public getSaveTransaction(): string {
    return this.createUrl(this._constants.API_URL_SAVE_TRANSACTION);
  }

  public getDepositWithdrawHistoryStatus(): string {
    return this.createUrl(this._constants.API_URL_DEPOSIT_WITHDRAW_HISTORY_STATUS);
  }

  public getDepositWithdrawHistoryStatusUpdate(): string {
    return this.createUrl(this._constants.API_URL_DEPOSIT_WITHDRAW_HISTORY_STATUS_UPDATE);
  }

  public getDashboard(): string {
    return this.createUrl(this._constants.API_URL_DASHBOARD);
  }

  public getSaveMarketEndpoint(): string {
    return this.createUrl(this._constants.API_URL_UPDATE_MARKET_STATUS);
  }

  public getWebSocketURLEndpoint(): string {
    return this.createUrl(this._constants.API_URL_GET_WEBSOCKET_URL);
  }

  public getWebSocketDataBySetORUnsetEndpoint(
    setOrUnset: string
  ): string {
    return this.createUrlWithPathVariables(this._constants.API_URL_SET_UNSET_WEBSOCKET_DATA, [setOrUnset]);
  }

  public getPlaceBetEndpoint(): string {
    return this.createUrl(this._constants.API_URL_PLACE_BET);
  }

  public getUserBetEndpoint(matchId): string {
    return this.createUrlWithPathVariables(this._constants.API_URL_GET_USER_BET, [matchId]);
  }

  public getBalanceInfoEndpoint(): string {
    return this.createUrl(this._constants.API_URL_GET_BALANCE_INFO);
  }

  public getAllNavEndPoint(): string {
    return this.createUrl(this._constants.API_URL_LIST_ALL_MENU);
  }

  public getTermCondEndPoint(): string {
    return this.createUrl(this._constants.API_URL_TERM_CONDITION);
  }

  public getInPlayUpcomingEndPoint(): string {
    return this.createUrl(this._constants.API_URL_GET_IN_PLAY_UPCOMING);
  }

  public getBookMakerEndPoint(): string {
    return this.createUrl(this._constants.API_URL_GET_BOOKMAKER_MARKET);
  }

  public getFancyMarketEndPoint(): string {
    return this.createUrl(this._constants.API_URL_GET_FANCY_MARKET);
  }

  public getTransferStatementEndPoint(): string{
    return this.createUrl(this._constants.API_URL_TRANSFER_STATEMENT);
  }

  public getUserConfigEndPoint():string{
    return this.createUrl(this._constants.API_URL_GET_USER_CONFIG)
  }

  public getSearchEventEndPoint(): string {
    return this.createUrl(this._constants.API_URL_LIST_DATA_BY_SEARCH);
  }

  public getSaveUserConfigEndPoint():string{
    return this.createUrl(this._constants.API_URL_SAVE_USER_CONFIG)
  }

  public getUserBets():string{
    return this.createUrl(this._constants.API_URL_OPEN_BETS)
  }

  public getUserOpenBets():string{
    return this.createUrl(this._constants.API_URL_USER_OPEN_BETS)
  }

  public getProfitLoss():string{
    return this.createUrl(this._constants.API_URL_PROFIT_LOSS)
  }

  public getBooksForMarket():string{
    return this.createUrl(this._constants.API_URL_BOOKS_MARKET)
  }

  public getCancelBetForMarket():string{
    return this.createUrl(this._constants.API_URL_CANCEL_BET)
  }

  public getAccountStatement():string{
    return this.createUrl(this._constants.API_URL_ACCOUNT_STATEMENT)
  }

}
