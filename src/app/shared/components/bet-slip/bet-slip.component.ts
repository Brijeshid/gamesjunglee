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

 userConfig:any=[];
  
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
    this.getUserConfig()
  }

  onClickPlaceBet(){
    // this.betSlipParams['profit'] = ;
    this.placeBet();
  }

  placeBet(){
    
    if(this.betSlipParams.marketName == 'MATCH ODDS'){
      let multiplier
      if(this.betSlipParams.odds >= 1){
        multiplier = this.betSlipParams.odds - 1
      }else{
        multiplier = 1- this.betSlipParams.odds 
      }
      
      this.betSlipParams.profit = multiplier * this.betSlipParams.stake
      this.betSlipParams.marketName = 'Match Odds'
    }
    console.log('Profit',this.betSlipParams)
    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (res: any) => {
        console.log('placebet',res);
        this._sharedService.getToastPopup(res.message,'Market Bet','success');
        this._getUserOpenBet()
        this.isBetSlipActive = false;
      });
    }

  _getUserOpenBet(){
    this._SharedService._getUserOpenBetsApi().subscribe(
      (res:any) => {
        console.log('User Bet',res)

        res.userBets.forEach(bet=>{
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
        this.userConfig = res  ;
        console.log('Event',res)
      });
  }

}
