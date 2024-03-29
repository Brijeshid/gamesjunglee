import { Component, OnInit } from '@angular/core';
import { InPlayService } from '../../services/in-play.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-in-play-index',
  templateUrl: './in-play-index.component.html',
  styleUrls: ['./in-play-index.component.scss']
})
export class InPlayIndexComponent implements OnInit {

  inPlayMatchListBySport:any=[];
  upComingMatchListBySport:any=[];

  realDataWebSocket:any;
  webSocketUrl:string;
  setOrUnsetWebSocketParamsObj:any = {
    upcoming:{
      centralIds:[]
    },
    inplay:{
      centralIds:[]
    }
  };
  setResponse:any= {};
  isLoggedIn:boolean = false;
  isMobileView:boolean;

  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.isMobileViewCallInit();
    this.isLoggedIn = this._sharedService.isLoggedIn();
    // this.initConfig();
    this._getWebSocketUrl();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      console.log(res);
      this.isMobileView = res;
    })
  }

  initConfig(){
    console.log(sessionStorage.getItem('deviceId'));
    (sessionStorage.getItem('deviceId') === null) ? this._getUniqueDeviceKeyApi(): this._getWebSocketUrl();
  }

  _getUniqueDeviceKeyApi(){
    this._sharedService._getUniqueDeviceKeyApi().subscribe((res:any)=>{
      sessionStorage.setItem('deviceId',res?.deviceId);
      this._getWebSocketUrl();
    })
  }

  getInPlayUpcomingData(paramsObj){
    this._sharedService._postInPlayUpcomingApi(paramsObj).subscribe((res)=>{
      if(res['matchDetails'].length > 0){
         res['matchDetails'][0]['sports'].map(sportsObj =>{

          paramsObj['upComing'] ?
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'] = _.concat(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']):
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'] = _.concat(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);

          sportsObj['isShowCard'] = false;
          return sportsObj['markets'].map(marketObj=>{
              if(marketObj['market']['appMarketStatus'] !=4 && marketObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
              return marketObj['market']['runners'].map((runnerRes) => {
                if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
                  runnerRes['back0'] ='';
                  runnerRes['vback0'] ='';

                  runnerRes['back1'] =  '';
                  runnerRes['vback1'] = '';

                  runnerRes['back2'] ='';
                  runnerRes['vback2'] = '';

                  runnerRes['lay0'] = '';
                  runnerRes['vlay0'] = '';

                  runnerRes['lay1'] =  '';
                  runnerRes['vlay1'] = '';

                  runnerRes['lay2'] = '';
                  runnerRes['vlay2'] = '';

                }else{
                  runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                  runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                  runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                  runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                  runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds']: '';
                  runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv']:'';

                  runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                  runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                  runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                  runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

                  runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds']: '';
                  runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

                }

                runnerRes['suspended'] = true;
                return runnerRes;
              })
          })
        })

        //console.log('upcoming',this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']);
        //console.log('inplay',this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);
        let newParamsObjs = paramsObj['upComing'] ? this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']:this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'];
        if(newParamsObjs.length > 0){
          let setObj = {
            set:{
              deviceId:sessionStorage.getItem('deviceId'),
              centralIdList:newParamsObjs
              }
          }
          this._setOrUnsetWebSocketData(setObj);
        }
      }
      //console.log('data',res['matchDetails']);
      paramsObj['upComing'] ?  this.upComingMatchListBySport = res['matchDetails']: this.inPlayMatchListBySport = res['matchDetails'];
    })
  }

  _getWebSocketUrl(isComplete = false){
    this._sharedService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          if(!isComplete){
            this.getInPlayUpcomingData({upComing:false}); //in-play
            this.getInPlayUpcomingData({upComing:true});  //upcoming
          }
          this._subscribeWebSocket()
        }
      });

  }

  _setOrUnsetWebSocketData(setOrUnsetWebSocketParamsObj){
      // this._sharedService._getWebSocketURLByDeviceApi(setOrUnsetWebSocketParamsObj).subscribe(
      //   (res: any) => {
      //     console.log('market',res);
      //     if(res?.token?.url){
      //       this.realDataWebSocket = webSocket(res?.token?.url);
      //       this._subscribeWebSocket()
      //     }
      //   });
  }


  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      let webSocketData = parseData['data'];
      if(this.inPlayMatchListBySport.length > 0 && this.inPlayMatchListBySport[0]['sports'].length >0){
        this.inPlayMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                resObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];
                if(resObj['market']['appMarketStatus'] !=4 && resObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
                return resObj['market']['runners'].map((runnerRes) => {
                  let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
                  for (let singleWebsocketRunner of webSocketRunners) {
                    if (singleWebsocketRunner['ib']) {
                      //back

                      //Live Rate
                      runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    } else {
                      //lay

                      //Live Rate
                      runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    }
                  }
                  // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                  //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                  //       runnerRes['suspended'] = false;
                  // }
                  return runnerRes;
                })
              }
          })
        })
      }

      if(this.upComingMatchListBySport.length > 0 &&this.upComingMatchListBySport[0]['sports'].length >0){
        this.upComingMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                resObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];
                if(resObj['market']['appMarketStatus'] !=4 && resObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
                return resObj['market']['runners'].map((runnerRes) => {
                  let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
                  for (let singleWebsocketRunner of webSocketRunners) {
                    if (singleWebsocketRunner['ib']) {
                      //back

                      //Live Rate
                      runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    } else {
                      //lay

                      //Live Rate
                      runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    }
                  }
                  // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                  //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                  //       runnerRes['suspended'] = false;
                  // }
                  return runnerRes;
                })
              }
          })
        })
      }
    }
  }

  _subscribeWebSocket(){
    this.realDataWebSocket.subscribe(
      data => {
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => {
        this._getWebSocketUrl(true);
        console.log(err)
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        this._getWebSocketUrl(true);
        console.log('complete')
      } // Called when connection is closed (for whatever reason).
    );
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset:{
        deviceId:sessionStorage.getItem('deviceId'),
        centralIdList:_.concat(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])
        }
    }
    this._setOrUnsetWebSocketData(unSetObj);
    // if(this.realDataWebSocket) this.realDataWebSocket.complete();
  }
}
