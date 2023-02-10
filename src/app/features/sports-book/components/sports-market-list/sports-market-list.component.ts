import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sports-market-list',
  templateUrl: './sports-market-list.component.html',
  styleUrls: ['./sports-market-list.component.scss']
})
export class SportsMarketListComponent implements OnInit {

  subNavList:any =[];
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

  sports:string;
  isBetSlipShow:boolean = false;

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this._getWebSocketUrl();
    })
  }

  getInPlayUpcomingData(){
    this._sharedService._postInPlayUpcomingApi({sportName:this.sports}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && (res['inPlayUpcomingMarket']['inPlayMarkets'].length > 0 
        || res['inPlayUpcomingMarket']['upComingMarkets'].length > 0)){

         res['inPlayUpcomingMarket']['inPlayMarkets'].map(sportsObj =>{
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'].push(sportsObj['market']['centralId']);
          return sportsObj['market']['runners'].map(runnerRes=>{
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


        res['inPlayUpcomingMarket']['upComingMarkets'].map(sportsObj =>{
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'].push(sportsObj['market']['centralId']);
          return sportsObj['market']['runners'].map(runnerRes=>{
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

        //merge both centralId
        console.log('data',res['matchDetails']);
        this.inPlayMatchListBySport = res['inPlayUpcomingMarket']['inPlayMarkets'];
        this.upComingMatchListBySport = res['inPlayUpcomingMarket']['upComingMarkets'];
        this._setOrUnsetWebSocketData(true,{'centralIds':_.merge(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])});

      }
    })
  }

  _getWebSocketUrl(){
    this._sharedService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          this.getInPlayUpcomingData(); //in-play //upcoming
        }
      });
  }

  _setOrUnsetWebSocketData(isSet:boolean,setOrUnsetWebSocketParamsObj){
    this._sharedService.postSetOrUnsetWebSocketDataApi(isSet,setOrUnsetWebSocketParamsObj).subscribe(
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
      if(this.inPlayMatchListBySport.length >0){
        this.inPlayMatchListBySport.map(sportsObj =>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', sportsObj['market']['marketId']]);
              return sportsObj['market']['runners'].map((runnerRes) => {
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
      }
      
      if(this.upComingMatchListBySport.length >0){
        this.upComingMatchListBySport.map(sportsObj =>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', sportsObj['market']['marketId']]);
              return sportsObj['market']['runners'].map((runnerRes) => {
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

  ngOnDestroy(): void {
    this._setOrUnsetWebSocketData(true,{'centralIds':_.merge(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])});
    this.realDataWebSocket.complete();
    // console.log('unset_destroy', this.centralIds);
    // this.realDataWebSocket.next({ "action": "unset", "markets": this.centralIds });
  }

}
