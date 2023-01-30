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
      centralIds:''
    },
    inplay:{
      centralIds:''
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
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'] = _.map(sportsObj['markets'], 'market.centralId').join(',') +','+ this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']:
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'] = _.map(sportsObj['markets'], 'market.centralId').join(',') +','+ this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'];

          return sportsObj['markets'].map(marketObj=>{
              return marketObj['market']['runners'].map((runnerRes) => {
                runnerRes['back1'] = '';
                runnerRes['vback1'] = '';
      
                runnerRes['back2'] = '';
                runnerRes['vback2'] = '';
      
                runnerRes['back3'] = '';
                runnerRes['vback3'] = '';
      
                runnerRes['lay1'] = '';
                runnerRes['vlay1'] = '';
      
                runnerRes['lay2'] = '';
                runnerRes['vlay2'] = '';
      
                runnerRes['lay3'] = '';
                runnerRes['vlay3'] = '';
      
                runnerRes['suspended'] = true;
                return runnerRes;
              })
          })
        })

        console.log('upcoming',this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']);
        console.log('inplay',this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);
        // localStorage.setItem('unset',JSON.stringify(this.setOrUnsetWebSocketParamsObj));
        let newParamsObjs = paramsObj['upComing'] ? this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']:this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'];
        if(newParamsObjs !=='') this._setOrUnsetWebSocketData(true,{'centralIds':newParamsObjs.replace(/,\s*$/, "")});
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
