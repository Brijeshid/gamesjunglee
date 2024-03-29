import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import * as moment from 'moment';
import {Location} from '@angular/common';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-betting-pl',
  templateUrl: './betting-pl.component.html',
  styleUrls: ['./betting-pl.component.scss']
})
export class BettingPlComponent implements OnInit, AfterViewInit {
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
  fromDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  toDate = moment().format("YYYY-MM-DD");

  toDateInit = moment().format("DD MMM YYYY")
  fromDateInit = moment(this.toDateInit).subtract(1, 'months').format("DD MMM YYYY")
  @ViewChild('dateRangePicker') dateRangePicker:ElementRef;
  preDefineDateRange = this.fromDateInit +' - '+ this.toDateInit;

  fileName= 'BettingPL.xlsx';

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _location: Location,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(){
    this.dateRangePicker['range'] = this.preDefineDateRange  //"13 Apr 2023 - 17 Apr 2023"
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getProfitLoss(this.fromDate,this.toDate);
  }

  exportExcel(){
     this._sharedService.exportExcel(this.profitLoss,this.fileName);
  }

  getProfitLoss(fromDate,toDate){
    this.isLoading = true;
    let profitLossObj = {
      fromDate:moment(fromDate).format("YYYY-MM-DD HH:mm:ss"),
      toDate:moment(toDate).set({hour:23,minute:59,second:59}).format("YYYY-MM-DD HH:mm:ss"),
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
