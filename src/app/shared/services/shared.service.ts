import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { IGNORED_STATUSES } from '@core/interceptors/http-error.interceptor';
import * as XLSX from 'xlsx';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  sharedSubject=new Subject();
  marketBookCalSubject=new Subject();
  private previousUrl: string = '';
  private currentUrl: string = '';
  getUserBalance = new Subject();
  isMobileView = new Subject();
  unmatchedBetsList:any = [];
  userIp:any;
  unMatchSubjectListSubject=new Subject();
  userBalance:any;
  ifBetSlipOpened = new BehaviorSubject(false);

  isisExpandedNavSideBar = new BehaviorSubject(true);
  router: any;
  liveStreamingTVUrl:any;
  liveScoreBoardUrl:any;
  realDataWebSocket: any;

  constructor(
    private _toastr: ToastrService,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _router:Router,
    private _location:Location
  ) {
    // this.currentUrl = this._route.url;
    // _route.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.previousUrl = this.currentUrl;
    //     this.currentUrl = event.url;
    //   };
    // });

    // this._location.back();
  }

  public exportExcel(fileData,fileName){
    /* pass here the table id */
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(fileData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

   public getPreviousUrl(){
    return this._location.back();
  }

  _getUserDetailsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserDetailEndpoint());
  }

  _getSportsListApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getSportsEndpoint());
  }

  _getSportsToursListApi(id:string) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getSportsToursByIdEndpoint(id));
  }

  _getToursMatchesListApi(id:string) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getToursMatchesByIdEndpoint(id));
  }


  getToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'info':
        this._toastr.info(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'success':
        this._toastr.success(errorMsg, errorModule, {
          progressBar: true
        });
        break;
    }
  }

  isLoggedIn(){
    return localStorage.getItem('jwtToken') ? true: false;
  }

  isUserActive(){
    return this.getUserDetails()['isActive'] =='Active' ? true : false ;
  }

  getJWTToken() {
    return localStorage.getItem('jwtToken');
  }

  setJWTToken(jwtToken:string){
    localStorage.setItem('jwtToken',jwtToken);
  }

  removeJWTToken(){
    localStorage.removeItem('jwtToken');
  }

  rtnSingleObjFromArrObj(arrObjParams:any, obj:any) {
    let key = Object.keys(obj)[0];
    return arrObjParams.filter(arrObjParam => arrObjParam[key] == obj[key])[0];
  }

  _replaceArrayObject(arr1, arr2,objKey) {
    return arr1.map(obj => arr2.find(o => o[objKey] === obj[objKey]) || obj);
  }

  _removeObjectFromArray(arr1,data){
    return arr1.filter(obj => obj.key != data.key);
  }
  removeToken(){
    localStorage.removeItem('jwtToken');
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  setUserDetails(userDetails){
    localStorage.setItem('userDetails',JSON.stringify(userDetails['user']));
  }

  removeUserDetails(){
    localStorage.removeItem('userDetails');
  }

  _getBalanceInfoApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getBalanceInfoEndpoint());
  }

  _getAllNavListApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getAllNavEndPoint());
  }

  getWebSocketURLApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getWebSocketURLEndpoint());
  }

  _postInPlayUpcomingApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getInPlayUpcomingEndPoint(), inPlayUpcomingBody);
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

  _postTourListApi(tourParams:any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSportsToursEndpoint(),tourParams);
  }

  _postSearchListApi(searchParams:any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSearchEventEndPoint(),searchParams);
  }

  _postPlaceBetApi(placeBetObjParams:object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getPlaceBetEndpoint(),placeBetObjParams,{
        context: new HttpContext().set(IGNORED_STATUSES, [600]),
      });
  }

  _getUserOpenBetsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserOpenBets());
  }

  _getBooksForMarketApi(marketIdListBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBooksForMarket(), marketIdListBody);
  }

  getIPApi() {
    return this._apiHttpService.get('https://jsonip.com');
  }

  postCancelBetForMarket(betIdListBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getCancelBetForMarket(), betIdListBody);
  }

  postLiveStreamForMarket(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLiveStreamMatch(), liveStreamMatchObj);
  }

  _getUniqueDeviceKeyApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUniqueDeviceKey());
  }

  _getWebSocketURLByDeviceApi(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getWebSocketURLByDevice(), liveStreamMatchObj);
  }

  getUserAdminPubSubApi(){
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserAdminPubSubEndPoint());
  }

  getUserRealTimeEvent(params:any){
    let currentUserDetails = this.getUserDetails();
    if (params) {
      this.realDataWebSocket = webSocket(params['url']);
      this.realDataWebSocket.subscribe(
        data => {
          if(currentUserDetails.userId == data.userId){
            switch(data.message){
              case "STATUS_CHANGED":
                if(data.status == 'Closed'){
                  this.logout();return;
                }
                currentUserDetails.isActive = data.status;
                localStorage.setItem('userDetails',JSON.stringify(currentUserDetails));
                window.location.reload();
                break;
              case "PASSWORD_CHANGED":
                this.logout();
                break;
              case "BET_MATCHED":
                this.unMatchSubjectListSubject.next(true);
                this.getToastPopup('Successfully Bet Matched','Bet Matched','success');
                break;
              case "WINNINGS_ADJUSTED":
              case "EDIT_USER":
              case "BET_DELETED_BY_ADMIN":
              case "RESULT_OUT":
                  this.getUserBalance.next();
              break;
            }
          }

        })
      }
  }

  unsubscribeWebSocket(){
    if(this.realDataWebSocket) this.realDataWebSocket.unsubscribe();
  }

  isMobileViewFn(){
    if(window.innerWidth <= 767){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    this.removeJWTToken();
    this.removeUserDetails();
    this._router.navigate(['/login']);
  }

}

