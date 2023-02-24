import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
  unMatchedBets :any[] = [];
  @Input() showMAtchwiseBet = ''
  userConfig:any=[];
  
  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService
    ) { }

  ngOnChanges(changes: SimpleChanges){
    if(!changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.betSlipParams =  changes['betSlipParams']['currentValue']
    }
  }
  ngOnInit(): void {
    this._getUserOpenBet()
    this.getUserConfig()
  }

  onClickPlaceBet(){
    if(this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS"){
      let multiplier = this.betSlipParams.odds >= 1 ? this.betSlipParams.odds - 1 : 1- this.betSlipParams.odds;
      this.betSlipParams.profit = multiplier * this.betSlipParams.stake
      this.betSlipParams.marketName = 'Match Odds'
    }

    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (res: any) => {
        this._sharedService.getToastPopup(res.message,'Market Bet','success');
        this._getUserOpenBet()
        this.isBetSlipActive = false;
        this._SharedService.getUserBalance.next();
      });
    }

  _getUserOpenBet(){
    this._SharedService._getUserOpenBetsApi().subscribe(
      (res:any) => {
        res.userBets.forEach(bet=>{
          if(this.showMAtchwiseBet) bet.bets = bet.bets.filter(b => b.matchName == this.showMAtchwiseBet)
          if(bet.status == "EXECUTION_COMPLETE"){
            this.matchedBets = bet.bets
          }else{
            this.unMatchedBets = bet.bets
          }
        })   
      })
   }

   getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res ;
      });
  }

}
