import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';
import * as _ from "lodash";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  betSlipForm:FormGroup;
  
  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

  ngOnChanges(changes: SimpleChanges){
    if(!changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.betSlipParams =  changes['betSlipParams']['currentValue']
      this.betSlipForm.patchValue({
        odds:this.betSlipParams['odds'],
        stake:this.betSlipParams['stake'],
      })
    }
  }
  ngOnInit(): void {
    this._getUserOpenBet();
    this.getUserConfig();
    this._createBetSlipForm();
  }
  _createBetSlipForm(){
    this.betSlipForm = this._fb.group({
      odds:['',Validators.required],
      stake:['',Validators.required]
    })
  }

  onClickPlaceBet(){
    if(this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS"){
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
      this.betSlipParams.profit = multiplier * this.betSlipForm.controls['stake'].value
      this.betSlipParams.marketName = 'Match Odds'
      this.betSlipParams.odds = this.betSlipForm.controls['odds'].value;
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
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

  stakeVal(val:any){
    debugger;
  }

  upAndDownOddsValue(isUp:boolean){
    this.betSlipForm.controls['odds'].setValue(isUp ? +(this.betSlipForm.controls['odds'].value + 0.01).toFixed(2) : +(this.betSlipForm.controls['odds'].value - 0.01).toFixed(2)) ;
  }

  updateStack(stackVal:any){
    this.betSlipForm.controls['stake'].setValue(parseInt(this.betSlipForm.controls['stake'].value) + parseInt(stackVal)) ; 
  }

   getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res ;
      });
  }

}
