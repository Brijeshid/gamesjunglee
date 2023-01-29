import { Component, OnInit } from '@angular/core';
import { InPlayService } from '../../services/in-play.service';
import { webSocket } from 'rxjs/webSocket';

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
  setOrUnsetWebSocketParamsObj = {};
  setResponse:any= {};
  
  constructor(
    private _inPlayService: InPlayService
  ) { }

  ngOnInit(): void {
    this.getInPlayUpcomingData({upComing:false}); //in-play
    this.getInPlayUpcomingData({upComing:true});  //upcoming
  }

  getInPlayUpcomingData(paramsObj){
    this._inPlayService._postInPlayUpcomingApi(paramsObj).subscribe((res)=>{
      paramsObj['upComing'] ?  this.upComingMatchListBySport = res['matchDetails']: this.inPlayMatchListBySport = res['matchDetails'];

      console.log('upComing',paramsObj['upComing'],res);
    })
  }

  _getWebSocketUrl(){
    this._inPlayService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          // this._getMarketData();
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
