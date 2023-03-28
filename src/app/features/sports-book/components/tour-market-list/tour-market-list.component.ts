import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import {Location} from '@angular/common';


@Component({
  selector: 'app-tour-market-list',
  templateUrl: './tour-market-list.component.html',
  styleUrls: ['./tour-market-list.component.scss']
})
export class TourMarketListComponent implements OnInit {

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

  tourId:any;
  tourName:string = 'NO MATCH AVAILABLE';
  sports:string;

  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;

  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  booksForMarket:any;
  placeBetData:any;

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn() && this._sharedService.isUserActive();
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this.tourId = routeParams.tourId;
      this.initConfig();
    })
    this._sharedService.getUserBalance.subscribe(res=>{
      this.placeBetData = [];
      if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
    })
  }

  ngAfterContentChecked() {
    this._sharedService.marketBookCalSubject.subscribe(res=>{
      this.placeBetData = res;
    })
    this._cdref.detectChanges();
  }

  initConfig(){
    (sessionStorage.getItem('deviceId') === null) ? this._getUniqueDeviceKeyApi(): this._getWebSocketUrl();
  }

  _getUniqueDeviceKeyApi(){
    this._sharedService._getUniqueDeviceKeyApi().subscribe((res:any)=>{
      sessionStorage.setItem('deviceId',res?.deviceId);
      this._getWebSocketUrl();
    })
  }

  getInPlayUpcomingData(){
    this._sharedService._postInPlayUpcomingApi({tournamentId:this.tourId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && (res['inPlayUpcomingMarket']['inPlayMarkets'].length > 0
        || res['inPlayUpcomingMarket']['upComingMarkets'].length > 0)){

         res['inPlayUpcomingMarket']['inPlayMarkets'].map(sportsObj =>{
          sportsObj['isExpand'] = true;
          sportsObj['status'] = 1;
          if(sportsObj?.tournamentName) this.tourName =  sportsObj['tournamentName'];
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
          sportsObj['isExpand'] = true;
          sportsObj['status'] = 1;
          if(sportsObj?.tournamentName) this.tourName =  sportsObj['tournamentName'];
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
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:_.merge(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])          
            }
          }
        this._setOrUnsetWebSocketData(setObj);
        if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
      }
    })
  }

  _getWebSocketUrl(){
      this.getInPlayUpcomingData(); //in-play //upcoming
  }

  _setOrUnsetWebSocketData(setOrUnsetWebSocketParamsObj){
    this._sharedService._getWebSocketURLByDeviceApi(setOrUnsetWebSocketParamsObj).subscribe(
      (res: any) => {
        console.log('market',res);
        if(res?.token?.url){
          this.realDataWebSocket = webSocket(res?.token?.url);
          this._subscribeWebSocket()
        } 
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
            if(singleWebSocketMarketData != undefined){
              sportsObj['status'] = singleWebSocketMarketData['ms'];
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
            }
        })
      }

      if(this.upComingMatchListBySport.length >0){
        this.upComingMatchListBySport.map(sportsObj =>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', sportsObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                sportsObj['status'] = singleWebSocketMarketData['ms'];
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
              }
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

  onClickLiveMarketRate(runnerObj:any,marketData:any,positionObj:any){
    console.log(runnerObj,marketData);
    this.betSlipObj = {
        "sportId":marketData['sportId'],
        "tournamentId":marketData['tournamentId'],
        "eventId":marketData['matchId'],
        "event":marketData['matchName'],
        "marketId":marketData['market']['marketId'],
        "marketName":marketData['marketType'],
        "sportName":this.sports,
        "odds": positionObj['odds'],
        "betPosition":positionObj['index'],
        "profit":0,
        "selectionId":runnerObj['SelectionId'],
        "selectionName":runnerObj['RunnerName'],
        "stake": 0,
        "isBack": positionObj['isBack'],
        "centralId":marketData['market']['centralId'],
        "runs":null,
        "matchTime":marketData['matchTime'],
        "book":marketData['market']['runners'],
        "isBetSlipActive":positionObj['odds'] > 0 ? true: false,
        "booksForMarket":this.booksForMarket,
        "runnerObj":marketData['market']['runners']
    }
  }

  getBooksForMarket(marketList:any){
    let markets= {marketIds : marketList.map(m=>m.market.marketId)}
    this._sharedService._getBooksForMarketApi(markets).subscribe((res:any) =>{
      let booksForMarket = this.booksForMarket = res?.booksForMarket;
      this.inPlayMatchListBySport.map((sportsObj)=>{
        let horseDataByMarketId = _.find(booksForMarket,['marketId',sportsObj['market']['marketId']]);
        return sportsObj['market']['runners'].map((singleRunner)=>{
          singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',singleRunner['SelectionId']]);
          return singleRunner;
        })
      });
    })
  }

  goBack(){
    this._location.back();
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset:{
        deviceId:sessionStorage.getItem('deviceId'),
        centralIdList:_.merge(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])        
        }
    }
    this._setOrUnsetWebSocketData(unSetObj);
    if(this.realDataWebSocket) this.realDataWebSocket.complete();
    // console.log('unset_destroy', this.centralIds);
    // this.realDataWebSocket.next({ "action": "unset", "markets": this.centralIds });
  }


}
