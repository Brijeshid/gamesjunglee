import { Component, OnInit } from '@angular/core';
import { InPlayService } from '../../services/in-play.service';

@Component({
  selector: 'app-in-play-index',
  templateUrl: './in-play-index.component.html',
  styleUrls: ['./in-play-index.component.scss']
})
export class InPlayIndexComponent implements OnInit {

  inPlayMatchListBySport:any=[];
  upComingMatchListBySport:any=[];
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
}
