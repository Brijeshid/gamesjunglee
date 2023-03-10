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
      this._getWebSocketUrl();
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
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn();
    this._sharedService.getUserBalance.subscribe((res:any)=>{
      switch(res['marketType'] && this.isLoggedIn){
        case EMarketType.MATCH_TYPE:
          this.placeBetData = [];
          if(this.inPlayUpcomingMarket ) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
          break;

        case EMarketType.BOOKMAKER_TYPE:
          this.placeBetData = [];
          if(this.bookMakerMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
          break;

        case EMarketType.FANCY_TYPE:
          if(this.fancyMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
          break;
      }
      this._cdref.detectChanges();
    })
  }

  getInPlayUpcomingData(){
    this._sharedService._postInPlayUpcomingApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && res['inPlayUpcomingMarket']?.matchName){
          this.matchName =  res['inPlayUpcomingMarket']['matchName'];
          res['inPlayUpcomingMarket']['status'] = 1;
          this.setOrUnsetWebSocketParamsObj['match']['centralIds'].push(res['inPlayUpcomingMarket']['centralId']);
          res['inPlayUpcomingMarket']['runners'].map(runnerRes=>{
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
        //merge both centralId
        this.inPlayUpcomingMarket = res['inPlayUpcomingMarket'];
        this._setOrUnsetWebSocketData(true,{'centralIds':this.setOrUnsetWebSocketParamsObj['match']['centralIds']});
        if(this.inPlayUpcomingMarket && this.isLoggedIn) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
      }
    })
  }

  getBookMakerData(){
    this._sportsBookService._postBookMakerMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res.length > 0){
        res.map(sportsObj =>{
          sportsObj['status'] = 1;
          this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds'].push(sportsObj['centralId']);
          return sportsObj['runners'].map(runnerRes=>{

                runnerRes['back0'] = '';
                runnerRes['vback0'] = '';

                runnerRes['lay0'] = '';
                runnerRes['vlay0'] = '';

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.bookMakerMarket = res;
        this._setOrUnsetWebSocketData(true,{'centralIds':this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds']});
        if(this.bookMakerMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
      }
    })
  }

  getFancyData(){
    this._sportsBookService._postFancyMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      console.log('res',res);
      if(res.length > 0){
        res.map(sportsObj =>{
          sportsObj['status'] = 1;
          this.setOrUnsetWebSocketParamsObj['fancy']['centralIds'].push(sportsObj['centralId']);
                sportsObj['back1'] = '';
                sportsObj['vback1'] = '';

                sportsObj['lay1'] = '';
                sportsObj['vlay1'] = '';

                sportsObj['suspended'] = true;
        })
        //merge both centralId
        this.fancyMarket = res;
        this._setOrUnsetWebSocketData(true,{'centralIds':this.setOrUnsetWebSocketParamsObj['fancy']['centralIds']});
        if(this.fancyMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
      }
    })
  }

  _getWebSocketUrl(){
    this._sharedService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          this.getInPlayUpcomingData(); //in-play
          this.getBookMakerData() //bookmaker
          this.getFancyData() //fancy
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
      // console.log('data', JSON.parse(data));
      let webSocketData = parseData['data'];
      if(this.inPlayUpcomingMarket?.matchName){
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', this.inPlayUpcomingMarket['marketId']]);
            if(singleWebSocketMarketData != undefined){
              this.inPlayUpcomingMarket['status'] = singleWebSocketMarketData['ms'];
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
            bookMakerObj['status'] = singleWebSocketMarketDataBook['ms'];
            return bookMakerObj['runners'].map((runnerRes) => {
              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];
                if (singleWebsocketRunnerBook['ib']) {
                  //back

                  //Live Rate
                  runnerRes['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);
                  console.log('rt',singleWebsocketRunnerBook['rt'])
              

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
                fancyMarketObj['status'] = singleWebSocketMarketDataBook['ms'];
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
        "book":marketData['runners'] || [{"SelectionId":marketData['SelectionId'],"RunnerName":marketData['marketName']}],
        "isBetSlipActive":positionObj['odds'] > 0 ? true: false,
        "runs":positionObj['runs'],
        "booksForMarket":this.booksForMarket,
        "runnerObj":marketData['runners']
    }

    console.log(this.betSlipObj)
  }

  getBooksForMarket(marketIdList:any,marketType){
    this._sharedService._getBooksForMarketApi(marketIdList).subscribe((res:any) =>{
      switch(marketType){
        case EMarketType.MATCH_TYPE:
          this.booksForMarket = res?.booksForMarket;
          let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',this.inPlayUpcomingMarket['marketId']]);
          this.inPlayUpcomingMarket['runners'].map((singleRunner)=>{
            singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',singleRunner['SelectionId']]);
            return singleRunner;
          })
          setTimeout(()=>{this.inPlayUpcomingMarket},0);
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
                singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',singleRunner['SelectionId']]);
                return singleRunner;
              })
            }
          })
          setTimeout(()=>{this.bookMakerMarket},0);
        break;

        case EMarketType.FANCY_TYPE:
          this.fancyMarket.map((singleFancy)=>{
            let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleFancy['marketId']]);
            if(horseDataByMarketId !== undefined){
              horseDataByMarketId?.horses.map((singleAmount)=>{
                singleAmount['horse'] = +singleAmount['horse'];
                return singleAmount;
              })
              singleFancy['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',singleFancy['SelectionId']]);
              return singleFancy;
            }
          })
          setTimeout(()=>{this.fancyMarket},0);
        break;
      }
    })
  }

  goBack(){
    this._location.back();
  }

}
