import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-open-bets',
  templateUrl: './open-bets.component.html',
  styleUrls: ['./open-bets.component.scss']
})
export class OpenBetsComponent implements OnInit {
  matchedBets :any[] = [];
  unMatchedBets :any[]= [];

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this._getUserBet();
  }

  _getUserBet(){
    this._userSettingsService._getUserBetsApi().subscribe(
      (res:any) => {

        if(res.openBets){
          res.openBets.forEach(b => {
            if(b.type == 'matchedBets'){
              this.matchedBets = b.betList;
            }
            else{
              this.unMatchedBets = b.betList;
              console.log('event', this.unMatchedBets)
            }
          })
        }
        console.log(res)
      });
  }
  goBack(){
    this._location.back();
  }

}
