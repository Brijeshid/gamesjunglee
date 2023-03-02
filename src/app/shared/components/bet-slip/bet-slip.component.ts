import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMarketName, EMarketType } from '@shared/models/shared';

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
  isBetSlipPlaceCall:boolean = false
  isLoaderStart:boolean = false;
  count:number;
  isBack:boolean;
  userBalance:any;

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
    if(changes['betSlipParams'] && !changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.stakeVal(this.betSlipForm.controls['stake'].value);
      this.betSlipParams =  changes['betSlipParams']['currentValue'];
      this.isBetSlipActive = changes['betSlipParams']['currentValue']['isBetSlipActive'];
      this.isBack = changes['betSlipParams']['currentValue']['isBack'];
      if(changes['betSlipParams']['currentValue']['marketName']!= EMarketType.FANCY_TYPE){
        this.betSlipForm.patchValue({
          odds:this.betSlipParams['odds'],
        })
        changes['betSlipParams']['currentValue']['marketName']== EMarketType.MATCH_TYPE ? this.count =5 : this.count= 1;
      }else{
        console.log("inside else")
        this.count = 2;
        this.betSlipForm.patchValue({
          odds:this.betSlipParams['runs'],
        })
      }

    }
    if(changes['marketType'] && !changes['marketType']?.isFirstChange() && changes['marketType']?.currentValue){
      this.marketType = changes['marketType']['currentValue'];
      if(this.marketType !== EMarketType.MATCH_TYPE) this.betSlipForm.controls['odds'].disable();
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }
  }
  ngOnInit(): void {
    this.isBack = this.betSlipParams?.isBack;
    this._getUserOpenBet();
    this.getUserConfig();
    this._createBetSlipForm();
    this.getUserBalance();
  }
  _createBetSlipForm(){
    this.betSlipForm = this._fb.group({
      odds:['',Validators.required],
      stake:['',[Validators.required]]
    })
  }

  onClickPlaceBet(){
    this.isBetSlipPlaceCall = true;
    if(this.marketType == EMarketType.MATCH_TYPE){
      this.count = 5;
    }else if(this.marketType == EMarketType.FANCY_TYPE){
      this.count = 2;
    }else{
      this.count = 1;
    }

    this.isLoaderStart = true;
      let internvalCount = setInterval(()=>{
        this.count--;
        if(this.count <= 0){
          clearInterval(internvalCount);
        }
      },1000);
      this._placeBetCall();
  }

  private _placeBetCall(){
    if(this.betSlipParams.marketName == EMarketName.MATCH_ODDS_SPACE || this.betSlipParams.marketName == EMarketName.MATCH_ODDS_UNDERSCORE){
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
      this.betSlipParams.profit = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      this.betSlipParams.marketName = 'Match Odds';
      this.betSlipParams.odds = this.betSlipForm.controls['odds'].value;
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }else if(this.betSlipParams.marketName == EMarketName.FANCY || this.betSlipParams.marketName == EMarketName.BOOKMAKER){
      let multiplier = this.betSlipParams['odds']/100;
      this.betSlipParams.profit = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      this.betSlipParams.marketName = this.betSlipParams.marketName == EMarketName.FANCY ? 'Fancy': 'Bookmaker';
      this.betSlipParams.odds = this.betSlipParams['odds'];
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }

    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (betSlipRes: any) => {
            if(this.count <=0 || betSlipRes){
              this._sharedService.getToastPopup(betSlipRes.message,'Market Bet','success');
              this._getUserOpenBet();
              this.betSlipForm.reset();
              this.isBetSlipActive = false;
              this.isBetSlipPlaceCall = false;
              this.isLoaderStart = false;
              this._SharedService.getUserBalance.next();
            }
      });
  }

  get profit(){
    if(this.betSlipParams.marketName == EMarketName.MATCH_ODDS_SPACE || this.betSlipParams.marketName == EMarketName.MATCH_ODDS_UNDERSCORE){
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
      return Math.round(multiplier * this.betSlipForm.controls['stake'].value)
    }else{
      let multiplier = this.betSlipParams['odds']/100;
      return Math.round(multiplier * this.betSlipForm.controls['stake'].value)
    }
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
    if(this.betSlipForm.controls['stake'].valid){
      let marketObj = {};
      marketObj[this.betSlipParams['marketId']] = {
        profit:0,
        loss:0,
        marketId:this.betSlipParams['marketId'],
        selectionId:this.betSlipParams['selectionId'],
        marketType:this.marketType
      };
      let calCulatedAmount;
      if(this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS" || this.betSlipParams.marketName == "BOOKMAKER"){
        let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value)
      }else{
        let multiplier = this.betSlipParams['odds']/100;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value)
      }

      marketObj[this.betSlipParams['marketId']]['profit'] = calCulatedAmount;
      marketObj[this.betSlipParams['marketId']]['loss'] = this.betSlipForm.controls['stake'].value;

      if(this.isBack){
        marketObj[this.betSlipParams['marketId']]['loss'] = this.betSlipForm.controls['stake'].value * -1;
      }else{
        marketObj[this.betSlipParams['marketId']]['profit'] = calCulatedAmount * -1;
      }
      this._sharedService.marketBookCalSubject.next(marketObj);
    }else{
      this._sharedService.marketBookCalSubject.next({});
    }
    
  }

  upAndDownOddsValue(isUp:boolean){
    this.betSlipForm.controls['odds'].setValue(isUp ? +(this.betSlipForm.controls['odds'].value + 0.01).toFixed(2) : +(this.betSlipForm.controls['odds'].value - 0.01).toFixed(2)) ;
  }

  updateStack(stackVal:any){
    if(isNaN(this.betSlipForm.controls['stake'].value) || this.betSlipForm.controls['stake'].value == "" || this.betSlipForm.controls['stake'].value == null){
      this.betSlipForm.controls['stake'].setValue(parseInt(stackVal)) ;
    }else{
      this.betSlipForm.controls['stake'].setValue(parseInt(this.betSlipForm.controls['stake'].value) + parseInt(stackVal)) ;
    }
    
  }

   getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res ;
      });
  }

  getUserBalance(){
    this._sharedService._getBalanceInfoApi().subscribe((res:any)=>{
      this.userBalance = res;
      if(res){
        this.betSlipForm.controls['stake'].setValidators([Validators.min(res?.minimumBet),Validators.max(res?.maxBet)]);
      }
    })
  }

}
