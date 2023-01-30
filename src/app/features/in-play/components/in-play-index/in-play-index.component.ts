import { Component, OnInit } from '@angular/core';
import { InPlayService } from '../../services/in-play.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { SharedService } from '@shared/services/shared.service';

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
  
  constructor(
    private _inPlayService: InPlayService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this._getWebSocketUrl();
  }

  getInPlayUpcomingData(paramsObj){
    this._inPlayService._postInPlayUpcomingApi(paramsObj).subscribe((res)=>{
      if(res['matchDetails'].length > 0){
         res['matchDetails'][0]['sports'].map(sportsObj =>{

          paramsObj['upComing'] ?
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'] = _.merge(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']):
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'] = _.merge(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);

          return sportsObj['markets'].map(marketObj=>{
              return marketObj['market']['runners'].map((runnerRes) => {
                runnerRes['back0'] = '';
                runnerRes['vback0'] = '';
      
                runnerRes['back1'] = '';
                runnerRes['vback1'] = '';
      
                runnerRes['back2'] = '';
                runnerRes['vback2'] = '';
      
                runnerRes['lay0'] = '';
                runnerRes['vlay0'] = '';
      
                runnerRes['lay1'] = '';
                runnerRes['vlay1'] = '';
      
                runnerRes['lay2'] = '';
                runnerRes['vlay2'] = '';
      
                runnerRes['suspended'] = true;
                return runnerRes;
              })
          })
        })

        console.log('upcoming',this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']);
        console.log('inplay',this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);
        // localStorage.setItem('unset',JSON.stringify(this.setOrUnsetWebSocketParamsObj));
        let newParamsObjs = paramsObj['upComing'] ? this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']:this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'];
        if(newParamsObjs.length > 0) this._setOrUnsetWebSocketData(true,{'centralIds':newParamsObjs});
      }
      console.log('data',res['matchDetails']);
      paramsObj['upComing'] ?  this.upComingMatchListBySport = res['matchDetails']: this.inPlayMatchListBySport = res['matchDetails'];
    })
  }

  _getWebSocketUrl(){
    this._inPlayService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          this.getInPlayUpcomingData({upComing:false}); //in-play
          this.getInPlayUpcomingData({upComing:true});  //upcoming
        }
      });
  }

  _setOrUnsetWebSocketData(isSet:boolean,setOrUnsetWebSocketParamsObj){
    this._inPlayService.postSetOrUnsetWebSocketDataApi(isSet,setOrUnsetWebSocketParamsObj).subscribe(
      (res: any) => {
        console.log('market',res);
        if(res?.marketCentralData) this.setResponse = res?.marketCentralData;
        this._subscribeWebSocket();
      });
  }


  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      console.log('data', JSON.parse(data));
      let webSocketData = parseData['data'];
      if(this.inPlayMatchListBySport[0]['sports'].length >0){
        this.inPlayMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
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
          })
        })
      }
      
      if(this.upComingMatchListBySport[0]['sports'].length >0){
        this.upComingMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
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
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
  }
}
