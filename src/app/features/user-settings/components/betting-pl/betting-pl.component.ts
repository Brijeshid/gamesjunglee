import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import * as moment from 'moment';
import {Location} from '@angular/common';

@Component({
  selector: 'app-betting-pl',
  templateUrl: './betting-pl.component.html',
  styleUrls: ['./betting-pl.component.scss']
})
export class BettingPlComponent implements OnInit {
  profitLoss : any[] = [];
  isLoading = false;
  options:any = {
    autoApply:false,
    clickOutsideAllowed:false,
    // displayFormat?: string;
    disabled:true,
    // disableInputDisplay:true;
    format: 'DD MMM YYYY',
    // icons?: 'default' | 'material' | 'font-awesome';
    // minDate: new Date().toJSON().slice(0,10).replace(/-/g,'/')
    // maxDate:;
    // position?: 'left' | 'right';
    // preDefinedRanges?: IDefinedDateRange[];
    // showResetButton?: boolean;
    // singleCalendar : true
    // validators?: ValidatorFn | ValidatorFn[];
    // modal?: boolean;
  };
  fromDate = moment().format("YYYY-MM-DD");
  toDate = moment().format("YYYY-MM-DD");

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.getProfitLoss(this.fromDate,this.toDate);
  }

  getProfitLoss(fromDate,toDate){
    this.isLoading = true;
    let profitLossObj = {
      fromDate:moment(fromDate).format("YYYY-MM-DD"),
      toDate:moment(toDate).format("YYYY-MM-DD"),
      game: null
    };
    this._userSettingsService._getProfitLossApi(profitLossObj).subscribe(
      (res:any) => {
       this.profitLoss = res.profitLoss.reverse();
       this.isLoading = false;
        console.log("getUser", res);
      }
    );
  }

  rangeSelected(event){
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  setPlBet(bets){
    console.log(bets)
    this._userSettingsService.setPlBets(bets)
    console.log('res',bets)
  }

  getProfitAndLoss(){
    this.getProfitLoss(this.fromDate,this.toDate);
  }

  goBack(){
    this._location.back();
  }

}
