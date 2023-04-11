import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMarketName, EMarketType } from '@shared/models/shared';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})
export class BetSlipComponent implements OnInit, OnChanges {

  @Input() isBetSlipActive:any;
  @Input() betSlipParams:any;
  @Input() showMAtchwiseBet = ''
  @Input() marketType:any = EMarketType.MATCH_TYPE;
  @Input() isTVEnable:boolean;

  EMarketType:typeof EMarketType = EMarketType;
  odds:number;
  stake:number;
  matchedBets :any[] = [];
  unMatchedBets :any[] = [];
  userConfig:any=[];
  betSlipForm:FormGroup;
  isBetSlipPlaceCall:boolean = false
  isLoaderStart:boolean = false;
  // count:number;
  isBack:boolean;
  userBalance:any;
  isSticky: boolean = false;
  matchId:number;
  liveStreamingTVUrl:any;
  exposure:number =0;

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _SharedService:SharedService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    public sanitizer: DomSanitizer
    ) { }


  ngOnChanges(changes: SimpleChanges){
    console.log(changes)
    if(changes['betSlipParams'] && !changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue){
      this.betSlipParams =  changes['betSlipParams']['currentValue'];
      this.isBack = changes['betSlipParams']['currentValue']['isBack'];
      this.isBetSlipActive = changes['betSlipParams']['currentValue']['isBetSlipActive'];

      if(!this.isBetSlipActive){
        this.betSlipForm.patchValue({
          odds:0,
          runs:0,
          stake:0
        })
        this.stakeVal(0);
      }

        this.betSlipForm.patchValue({
          odds:this.betSlipParams['odds'],
          runs:this.betSlipParams['runs'],
        })
      changes['betSlipParams']['currentValue']['marketName']== EMarketType.MATCH_TYPE;
      
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }
    if(changes['marketType'] && !changes['marketType']?.isFirstChange() && changes['marketType']?.currentValue){
      this.marketType = changes['marketType']['currentValue'];
      if(this.marketType !== EMarketType.MATCH_TYPE) this.betSlipForm.controls['odds'].disable();
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }

    if(changes['isTVEnable'] && !changes['isTVEnable'].isFirstChange()){
      this.isTVEnable =  changes['isTVEnable']['currentValue'];
      if(this.isTVEnable){
        this.startStreamingLiveTV();
      }else{
        this.liveStreamingTVUrl = undefined;
      }
    }
  }
  ngOnInit(): void {
    this._route.params.subscribe(routeParams =>{
      this.matchId = routeParams.matchId;
    });

    this.isBack = this.betSlipParams?.isBack;
    this._createBetSlipForm();
    this.getUserBalance();
    this._getUserOpenBet();
    this.getUserConfig();
  }
  _createBetSlipForm(){
    this.betSlipForm = this._fb.group({
      odds:['',[Validators.required,Validators.min(1.01)]],
      runs:[{value: '', disabled: true},[Validators.required]],
      stake:['',[Validators.required]]
    })
  }

  onClickPlaceBet(){
    this.isBetSlipPlaceCall = true;

    // if(this.marketType == EMarketType.MATCH_TYPE){
    //   this.count = 5;
    // }else if(this.marketType == EMarketType.FANCY_TYPE){
    //   this.count = 2;
    // }else{
    //   this.count = 1;
    // }

    this.isLoaderStart = true;
    // let internvalCount = setInterval(()=>{
    //   // this.count--;
    //   if(this.count <= 0){
    //     clearInterval(internvalCount);
    //   }
    // },1000);
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
    this._sharedService.getIPApi().subscribe(res=>{
      this.betSlipParams['userIp'] = res['ip'];
      this.betSlipParams['exposure'] = this.exposure;
      this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
        (betSlipRes: any) => {
              if( betSlipRes){
                this.isBetSlipActive = false;
                this.isBetSlipPlaceCall = false;
                this.isLoaderStart = false;
                this._SharedService.getUserBalance.next({'marketType': this.marketType});
                this.betSlipForm.reset();
                this._getUserOpenBet();
                this._sharedService.getToastPopup(betSlipRes.message,'Market Bet','success');
              }
        },
        (err)=>{
          console.log('eee',err);
          this.isBetSlipActive = false;
          this.isBetSlipPlaceCall = false;
          this.isLoaderStart = false;
          this._SharedService.getUserBalance.next({'marketType': this.marketType});
          this.betSlipForm.reset();
          this._getUserOpenBet();
        });
    })
    
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
    if(this.betSlipForm.controls['stake'].valid && val!==0){
      let marketObj = {};
      let calCulatedAmount = 0;
      if(this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS"){
        let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1- this.betSlipForm.controls['odds'].value;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      }else{
        let multiplier = this.betSlipParams['odds']/100;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value)
      }

      let backUnMatchRunnerAmount = this.betSlipForm.controls['stake'].value * -1;
      let layUnMatchRunnerAmount = calCulatedAmount * -1;

      let marketId = this.betSlipParams['marketId'];
      marketObj['marketType'] = this.marketType;

      marketObj[marketId] = {};
      let bookMarketByMarketId = _.find(this.betSlipParams.booksForMarket,['marketId',marketId]);
      this.getRunnerId().map((runnerId:any)=>{
        marketObj[marketId][runnerId] = {};
        if(runnerId == this.betSlipParams.selectionId){
          marketObj[marketId][runnerId]['amount'] = this.isBack ? calCulatedAmount  : layUnMatchRunnerAmount;
        }else{
          marketObj[marketId][runnerId]['amount'] = this.isBack ? backUnMatchRunnerAmount : this.betSlipForm.controls['stake'].value;
        }
        if(this.betSlipParams?.booksForMarket.length > 0){
          if(bookMarketByMarketId){
            let bookMarketAmtByRunnerId = _.find(bookMarketByMarketId?.horses,['horse',runnerId]); //need to add amount variable from horse
            bookMarketAmtByRunnerId ? marketObj[marketId][runnerId]['amount'] +=  bookMarketAmtByRunnerId?.amount : '';
          }
        }
      })

      let netExposure = Object.values(marketObj[marketId])
      this.exposure = Math.min(...netExposure.map((horse:any) => horse.amount));
      this._sharedService.marketBookCalSubject.next(marketObj);
    }else{
      this._sharedService.marketBookCalSubject.next({});
    }

  }

  upAndDownOddsValue(isUp:boolean){
    this.betSlipForm.controls['odds'].setValue(isUp ? +(this.betSlipForm.controls['odds'].value + 0.01).toFixed(2) : +(this.betSlipForm.controls['odds'].value - 0.01).toFixed(2)) ;
    this.stakeVal(0);
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
        this.betSlipForm.controls['stake'].setValidators([Validators.required,Validators.min(res?.minimumBet),Validators.max(res?.maxBet)]);
      }
    })
  }

  getRunnerId(){
    return _.map(this.betSlipParams['runnerObj'],'SelectionId');
  }

  cancelBet(betListObj:any,marketType:string,cancelBetLevel:any){
    console.log(betListObj);
    let betList:any = [];
    switch(cancelBetLevel){
      case 1:
        if(betListObj.length >0 && betListObj[0]['markets'].length >0){
          betListObj[0]['markets'].map((singleMarket)=>{
            singleMarket.runners.map((singleRunner) =>{
              singleRunner.bets.map((singleBet) =>{
                betList.push(singleBet['betId']);
              })
            })
          })
        }
      break;

      case 2:
        if(betListObj['runners'].length >0){
          betListObj.runners.map((singleRunner) =>{
            singleRunner.bets.map((singleBet) =>{
              betList.push(singleBet['betId']);
            })
          })
        }
      break;

      case 3:
        if(betListObj?.betId) betList.push(betListObj.betId);
      break;

    }

    console.log(betList);
    
    let betIdObj = {
      betIdList: betList
    }
    this._sharedService.postCancelBetForMarket(betIdObj).subscribe((res)=>{
      marketType = marketType.toUpperCase();
        switch(marketType){
          case EMarketName.MATCH_ODDS_UNDERSCORE:
          case EMarketName.MATCH_ODDS_SPACE:
            this._SharedService.getUserBalance.next({'marketType': EMarketType.MATCH_TYPE});
          break;

          case EMarketName.BOOKMAKER:
            this._SharedService.getUserBalance.next({'marketType': EMarketType.BOOKMAKER_TYPE});
          break;

          case EMarketName.FANCY:
            this._SharedService.getUserBalance.next({'marketType': EMarketType.FANCY_TYPE});
          break;

          case 'ALL':
            this._SharedService.getUserBalance.next({'marketType': EMarketType.MATCH_TYPE});
            this._SharedService.getUserBalance.next({'marketType': EMarketType.BOOKMAKER_TYPE});
            this._SharedService.getUserBalance.next({'marketType': EMarketType.FANCY_TYPE});
          break;
        }

        this._getUserOpenBet();
    })
  }

  cancelBetSlip(){
    this.stakeVal(0);
    this.betSlipForm.controls['stake'].setValue("");
    this.isBetSlipActive=false;
    this.betSlipParams['isBack'] = false;
  }

  startStreamingLiveTV(){
    this._sharedService.postLiveStreamForMarket({matchId:this.matchId}).subscribe((res:any)=>{
      this.liveStreamingTVUrl = res?.streamObj?.data?.streamingUrl;
      console.log("tv",res);
    })
  }

}
