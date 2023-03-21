import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-betting-pl',
  templateUrl: './betting-pl.component.html',
  styleUrls: ['./betting-pl.component.scss']
})
export class BettingPlComponent implements OnInit {
  profitLoss : any[] = [];
  options:any = {
    // autoApply?: boolean;
    // clickOutsideAllowed?: boolean;
    // displayFormat?: string;
    // disabled?: boolean;
    // disableInputDisplay?: boolean;
    format: 'DD MMM YYYY',
    // icons?: 'default' | 'material' | 'font-awesome';
    // labelText?: string;
    // minDate: new Date().toJSON().slice(0,10).replace(/-/g,'/')
    // maxDate:;
    // position?: 'left' | 'right';
    // preDefinedRanges?: IDefinedDateRange[];
    // showResetButton?: boolean;
    singleCalendar : true
    // validators?: ValidatorFn | ValidatorFn[];
    // modal?: boolean;
  };

  constructor(
    private _userSettingsService: UserSettingsMainService,
    // private _userSettingsService:UserSettingsDataService
  ) { }

  ngOnInit(): void {
    this.getProfitLoss();
  }

  getProfitLoss(){
    let profitLossObj = {
      fromDate:"2023-02-19",
      toDate:"2023-03-21",
      game: null
    };
    this._userSettingsService._getProfitLossApi(profitLossObj).subscribe(
      (res:any) => { 
       this.profitLoss = res.profitLoss.reverse();
        console.log("getUser", res);
      }
    );
  }

  setPlBet(bets){
    console.log(bets)
    this._userSettingsService.setPlBets(bets)
    console.log('res',bets)
  }

}
