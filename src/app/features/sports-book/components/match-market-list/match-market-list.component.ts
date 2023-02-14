import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { SportsBookService } from '../../services/sports-book.service';

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
  
  constructor(
    private _sharedService: SharedService,
    private _sportsBookService: SportsBookService,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn();
    this._route.params.subscribe(routeParams =>{
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;
      this._getWebSocketUrl();
    })
  }

  getInPlayUpcomingData(){
    this._sharedService._postInPlayUpcomingApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && res['inPlayUpcomingMarket']?.matchName){
          this.matchName =  res['inPlayUpcomingMarket']['matchName'];
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
      }
    })
  }

  getBookMakerData(){
    this._sportsBookService._postBookMakerMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res.length > 0){
        res.map(sportsObj =>{
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
      }
    })
  }

  getFancyData(){
    this._sportsBookService._postFancyMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      console.log('res',res);
      if(res.length > 0){
        res.map(sportsObj =>{
          this.setOrUnsetWebSocketParamsObj['fancy']['centralIds'].push(sportsObj['centralId']);
                sportsObj['back0'] = '';
                sportsObj['vback0'] = '';

                sportsObj['lay0'] = '';
                sportsObj['vlay0'] = '';
      
                sportsObj['suspended'] = true;
        })
        //merge both centralId
        this.fancyMarket = res;
        this._setOrUnsetWebSocketData(true,{'centralIds':this.setOrUnsetWebSocketParamsObj['match']['centralIds']});
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
      console.log('data', JSON.parse(data));
      let webSocketData = parseData['data'];
      if(this.inPlayUpcomingMarket?.matchName){
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', this.inPlayUpcomingMarket['marketId']]);
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

      if(this.bookMakerMarket){
        let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', this.bookMakerMarket['marketId']]);
            this.bookMakerMarket['runners'].map((runnerRes) => {
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                if (singleWebsocketRunnerBook['ib']) {
                  //back
    
                  //Live Rate
                  runnerRes['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];
    
                  //Volume from Betfair
                  runnerRes['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['bv'];
    
                } else {
                  //lay
    
                  //Live Rate
                  runnerRes['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];
    
                  //Volume from Betfair
                  runnerRes['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['bv'];
    
                }
              }
              return runnerRes;
          })
      }

      if(this.fancyMarket){

      }


    }
  }

  _subscribeWebSocket(){
    this.realDataWebSocket.subscribe(
      data => {
        // if(typeof data == 'string') this._updateMarketData(data);
        if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
  }

}
