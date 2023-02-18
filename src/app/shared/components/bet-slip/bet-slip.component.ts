import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})
export class BetSlipComponent implements OnInit, OnChanges {

  @Input() isBetSlipActive:boolean = false;
  @Input() betSlipParams:any;
  odds:number;
  stake:number;
  matchedBets :any[] = [];
  
  constructor(private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService
    ) { }

  ngOnChanges(changes: SimpleChanges){
    console.log('changes');
    if(!changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.betSlipParams =  changes['betSlipParams']['currentValue']
    }
  }
  ngOnInit(): void {
    this._getUserOpenBet()
  }

  onClickPlaceBet(){
    // this.betSlipParams['profit'] = ;
    this.placeBet();
  }

  placeBet(){
    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (res: any) => {
        console.log('placebet',res);
        this._sharedService.getToastPopup('You have Successfully Placed Bet','Market Bet','success');
      });
  }

  _getUserOpenBet(){
    this._SharedService._getUserOpenBetsApi().subscribe(
      (res) => {
            console.log(res)

          })
   }

}
