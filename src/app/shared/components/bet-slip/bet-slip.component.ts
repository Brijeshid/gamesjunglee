import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMarketType } from '@shared/models/shared';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})
export class BetSlipComponent implements OnInit, OnChanges {

  @Input() isBetSlipActive:boolean = false;
  @Input() betSlipParams:any;
  @Input() showMAtchwiseBet = ''
  @Input() marketType:any = EMarketType.MATCH_TYPE;

  EMarketType:typeof EMarketType = EMarketType;
  odds:number;
  stake:number;
  matchedBets :any[] = [];
  unMatchedBets :any[] = [];
  userConfig:any=[];
  betSlipForm:FormGroup;
  isBetSlipCallCompleted:boolean = false
  isLoaderStart:boolean = false;
  count:number = 5;

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
    if(changes['betSlipParams'] && !changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.betSlipParams =  changes['betSlipParams']['currentValue'];
      this.isBetSlipActive = changes['betSlipParams']['currentValue']['isBetSlipActive'];

      if(changes['betSlipParams']['currentValue']['marketName']!="FANCY"){
        this.betSlipForm.patchValue({
          odds:this.betSlipParams['odds'],
        })
      }else{
        console.log("inside else")
        this.betSlipForm.patchValue({
          odds:this.betSlipParams['runs'],
        })
      }

    }
    if(changes['marketType'] && !changes['marketType']?.isFirstChange() && changes['marketType']?.currentValue){
      this.marketType = changes['marketType']['currentValue'];
      if(this.marketType !== EMarketType.MATCH_TYPE) this.betSlipForm.controls['odds'].disable();
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
    if(this.marketType == EMarketType.MATCH_TYPE){
      this.isLoaderStart = true;
      let internvalCount = setInterval(()=>{
        this.count--;
        if(this.count <= 0){
          this.isLoaderStart = false;
          clearInterval(internvalCount);
        }
      },1000);
      this._placeBetCall();
    }else{
      this.count =0;
      this._placeBetCall();
    }
  }

  private _placeBetCall(){
    if(this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS" || this.betSlipParams.marketName == "BOOKMAKER"){
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
      this.betSlipParams.profit = multiplier * this.betSlipForm.controls['stake'].value
      this.betSlipParams.marketName = 'Match Odds'
      this.betSlipParams.odds = this.betSlipForm.controls['odds'].value;
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }else if(this.betSlipParams.marketName == 'FANCY'){
      let multiplier = this.betSlipParams['odds']/100;
      this.betSlipParams.profit = multiplier * this.betSlipForm.controls['stake'].value
      this.betSlipParams.marketName = 'Fancy'
      this.betSlipParams.odds = this.betSlipParams['odds'];
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }

    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (betSlipRes: any) => {
            if(this.count <=0){
              this._sharedService.getToastPopup(betSlipRes.message,'Market Bet','success');
              this._getUserOpenBet();
              this.betSlipForm.reset();
              this.isBetSlipActive = false;
              this.isBetSlipCallCompleted = true;
              this._SharedService.getUserBalance.next();
            }
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
            this._sharedService.unmatchedBetsList = bet.bets;
          }
        })
      })
   }

  stakeVal(val:any){
    //calculate profit and loss with marketID
    this._sharedService.marketBookCalSubject.next({});
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
