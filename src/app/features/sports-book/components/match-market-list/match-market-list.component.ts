import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { SportsBookService } from '../../services/sports-book.service';
import {Location} from '@angular/common';
import { EMarketType } from '@shared/models/shared';

@Component({
  selector: 'app-match-market-list',
  templateUrl: './match-market-list.component.html',
  styleUrls: ['./match-market-list.component.scss']
})
export class MatchMarketListComponent implements OnInit {

  subNavList:any =[];
  inPlayUpcomingMarket:any=[];
  bookMakerMarket:any=[];
  fancyMarket:any=[];

  realDataWebSocket:any;
  webSocketUrl:string;
  setOrUnsetWebSocketParamsObj:any = {
    match:{
      centralIds:[]
    },
    bookMaker:{
      centralIds:[]
    },
    fancy:{
      centralIds:[]
    }
  };
  setResponse:any= {};

  tourId:any;
  matchId:any;
  matchName:string = 'NO MATCH AVAILABLE';

  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;

  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  sports:string;

  EMarketType:typeof EMarketType = EMarketType;
  marketType = EMarketType.MATCH_TYPE;
  placeBetData:any;
  booksForMarket:any;
  ladderObj:any = {};
  isTVEnable:boolean = false;
  isMatchLive:number =0;
  isFancyCardShow:boolean = false;

  constructor(
    private _sharedService: SharedService,
    private _sportsBookService: SportsBookService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;
      this.initConfig();
    });
    this._preConfig();
  }

  ngAfterContentChecked() {
    this._sharedService.marketBookCalSubject.subscribe(res=>{
      this.placeBetData = res;
    })

    this._cdref.detectChanges();
  }

  private _preConfig(){
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn() && this._sharedService.isUserActive();
    this._sharedService.getUserBalance.subscribe((res:any)=>{
      switch(res['marketType']){
        case EMarketType.MATCH_TYPE:
          this.placeBetData = [];
          if(this.inPlayUpcomingMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
          break;

        case EMarketType.BOOKMAKER_TYPE:
          this.placeBetData = [];
          if(this.bookMakerMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
          break;

        case EMarketType.FANCY_TYPE:
          if(this.fancyMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
          break;
      }
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
    this._sharedService._postInPlayUpcomingApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && res['inPlayUpcomingMarket']?.matchName){
          this.matchName =  res['inPlayUpcomingMarket']['matchName'];
          this.isMatchLive = res['inPlayUpcomingMarket']['inPlayStatus'];
          this.setOrUnsetWebSocketParamsObj['match']['centralIds'].push(res['inPlayUpcomingMarket']['centralId']);
          res['inPlayUpcomingMarket']['runners'].map(runnerRes=>{

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

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        //merge both centralId
        this.inPlayUpcomingMarket = res['inPlayUpcomingMarket'];
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:this.setOrUnsetWebSocketParamsObj['match']['centralIds']
            }
          }
        this._setOrUnsetWebSocketData(setObj);
        if(this.inPlayUpcomingMarket && this.isLoggedIn) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
      }
    })
  }

  getBookMakerData(){
    this._sportsBookService._postBookMakerMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res.length > 0){
        res.map(sportsObj =>{
          this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds'].push(sportsObj['centralId']);
          return sportsObj['runners'].map(runnerRes=>{

            runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
            runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

            runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
            runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.bookMakerMarket = res;
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds']
            }
          }
        this._setOrUnsetWebSocketData(setObj);
        if(this.bookMakerMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
      }
    })
  }

  getFancyData(){
    this._sportsBookService._postFancyMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      console.log('res',res);
      if(res.length > 0){
        res.map(sportsObj =>{
          if(sportsObj['appMarketStatus'] !=4) this.isFancyCardShow = true;
          this.setOrUnsetWebSocketParamsObj['fancy']['centralIds'].push(sportsObj['centralId']);
                sportsObj['back1'] = sportsObj['batb'][1] !== undefined ? sportsObj['batb'][1]['odds']: '';
                sportsObj['vback1'] = sportsObj['batb'][1] !== undefined ? sportsObj['batb'][1]['tv']:'';

                sportsObj['lay1'] = sportsObj['batl'][1] !== undefined ? sportsObj['batl'][1]['odds']: '';
                sportsObj['vlay1'] = sportsObj['batl'][1] !== undefined ? sportsObj['batl'][1]['tv']:'';

                sportsObj['suspended'] = true;
        })
        //merge both centralId
        this.fancyMarket = res;
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:this.setOrUnsetWebSocketParamsObj['fancy']['centralIds']
            }
          }
        this._setOrUnsetWebSocketData(setObj);
        if(this.fancyMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
      }
    })
  }

  _getWebSocketUrl(){
    this.getInPlayUpcomingData(); //in-play
    this.getBookMakerData() //bookmaker
    this.getFancyData() //fancy
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
      // console.log('data', JSON.parse(data));
      let webSocketData = parseData['data'];
      if(this.inPlayUpcomingMarket?.matchName){
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', this.inPlayUpcomingMarket['marketId']]);
            if(singleWebSocketMarketData != undefined){
              this.inPlayUpcomingMarket['appMarketStatus'] = singleWebSocketMarketData['ms'];
              this.inPlayUpcomingMarket['runners'].map((runnerRes) => {
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
      }

      if(this.bookMakerMarket){
        this.bookMakerMarket.map(bookMakerObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +bookMakerObj['marketId']]);
          if(singleWebSocketMarketDataBook != undefined){
            bookMakerObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
            return bookMakerObj['runners'].map((runnerRes) => {
              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];
                if (singleWebsocketRunnerBook['ib']) {
                  //back

                  //Live Rate
                  runnerRes['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);


                  //Volume from Betfair
                  runnerRes['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['bv'];

                } else {
                  //lay

                  //Live Rate
                  runnerRes['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);

                  //Volume from Betfair
                  runnerRes['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['bv'];

                }
              }
              return runnerRes;
            })
          }
        })
      }

      if(this.fancyMarket){
        this.fancyMarket.map(fancyMarketObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +fancyMarketObj['marketId']]);
              if(singleWebSocketMarketDataBook != undefined){
                fancyMarketObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
                if(fancyMarketObj['appMarketStatus'] !=4) this.isFancyCardShow = true;
                fancyMarketObj['SelectionId'] = fancyMarketObj['SelectionId'].toString();
                let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', fancyMarketObj['SelectionId']]);
                for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                  if (singleWebsocketRunnerBook['ib']) {
                    //back

                    //Live Rate
                    fancyMarketObj['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  } else {
                    //lay

                    //Live Rate
                    fancyMarketObj['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  }
                }
                return fancyMarketObj;
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

  onClickLiveMarketRate(runnerObj:any,marketData:any,positionObj:any,marketType:number){
    console.log(runnerObj,marketData);
    console.log(marketData['SelectionId'])
    console.log(marketData['RunnerName'])
    this.marketType = marketType;
    this.betSlipObj = {
        "sportId":marketData['refSportId'],
        "tournamentId":marketData['refTournamentId'],
        "eventId":marketData['matchId'],
        "event":marketData['matchName'],
        "marketId":marketData['marketId'],
        "marketName":marketData['marketType'],
        "sportName":this.sports,
        "odds": positionObj['odds'],
        "betPosition":positionObj['index'],
        "profit":0,
        "selectionId":runnerObj ? runnerObj['SelectionId']: marketData['SelectionId'],
        "selectionName":runnerObj? runnerObj['RunnerName']: marketData['marketName'],
        "stake": 0,
        "isBack": positionObj['isBack'],
        "centralId":marketData['centralId'],
        "matchTime":marketData['matchTime'],
        "book":marketData['runners'] || [{"SelectionId":marketData['SelectionId'],"RunnerName":marketData['marketName'],"back1":marketData['back1'],"lay1":marketData['lay1']}],
        "isBetSlipActive":positionObj['odds'] > 0 ? true: false,
        "runs":positionObj['runs'],
        "booksForMarket":this.booksForMarket,
        "runnerObj":marketData['runners'],
        "marketTypeName":marketData['marketName']
    }

    console.log(this.betSlipObj)
  }

  getBooksForMarket(marketIdList:any,marketType){
    if(marketIdList?.marketIds?.length > 0 ){
      this._sharedService._getBooksForMarketApi(marketIdList).subscribe((res:any) =>{
        switch(marketType){
          case EMarketType.MATCH_TYPE:
            this.booksForMarket = res?.booksForMarket;
            let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',this.inPlayUpcomingMarket['marketId']]);
            horseDataByMarketId?.horses.map((singleAmount)=>{
              singleAmount['horse'] = +singleAmount['horse'];
              return singleAmount;
            })
            this.inPlayUpcomingMarket['runners'].map((singleRunner)=>{
              singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
              return singleRunner;
            })
          break;

          case EMarketType.BOOKMAKER_TYPE:
            this.bookMakerMarket.map((singleBookMaker)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleBookMaker['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                 return singleBookMaker['runners'].map((singleRunner)=>{
                  singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
                  return singleRunner;
                })
              }
            })
          break;

          case EMarketType.FANCY_TYPE:
            this.fancyMarket.map((singleFancy)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleFancy['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                singleFancy['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleFancy['SelectionId']]);
                return singleFancy;
              }
            })
          break;
        }
      })
    }
  }

  getLadderDataByMarket(marketId:any){
    this._sportsBookService._postLadderDataByMarketApi({marketId:marketId}).subscribe((res:any)=>{
      this.ladderObj = res?.ladderDetails;
      console.log(this.ladderObj,res);
    })
  }

  hideShowTV(){
    this.isTVEnable = !this.isTVEnable;
  }

  goBack(){
    this._location.back();
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset:{
        deviceId:sessionStorage.getItem('deviceId'),
        centralIdList:_.concat(this.setOrUnsetWebSocketParamsObj['match']['centralIds'],
        this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds'],this.setOrUnsetWebSocketParamsObj['fancy']['centralIds']
         )
        }
    }
    this._setOrUnsetWebSocketData(unSetObj);
    if(this.realDataWebSocket) this.realDataWebSocket.complete();
  }

}
