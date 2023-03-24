import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import * as moment from 'moment';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {
  allSports: any;
  accountStatement:any[] = [];
  filterForm:FormGroup;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize:number = 10;
  display = '';
  language = "en";
  sportslist :any[]=[];
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
    private _sharedservice: SharedService,
    private _fb: FormBuilder

  ) {
    this.filterForm =  this._fb.group({
      // fromDate:new FormControl(this.formatFormDate(new Date())),
      // toDate:new FormControl(this.formatFormDate(new Date())),
      // sportsId:new FormControl(null),
      sportId: [4, [Validators.required]],
   })

  }

  // formatFormDate(date: Date) {
  //   return formatDate(date, this.dateFormat,this.language);
  // }


  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
    this.getAccountStatement();
    this.getSports();
  }

  rangeSelected(event) {
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  getSports() {
    this._sharedservice._getSportsListApi().subscribe((res: any) => {
      this.allSports = res;
    });
  }
  


  getAccountStatement(){
    // let fromDate = new Date(this.filterForm.value.fromDate);
    // fromDate.setHours(0)
    // fromDate.setMinutes(0);
    // fromDate.setSeconds(0);

    // let toDate = new Date(this.filterForm.value.toDate);
    // toDate.setHours(23)
    // toDate.setMinutes(59);
    // toDate.setSeconds(59);
    const payload = {
      // fromDate : "Sun Jan 01 2023 00:00:00 GMT+0530 (India Standard Time)",
      // toDate : "Sun Mar 31 2023 00:00:00 GMT+0530 (India Standard Time)",
      // sportId : '4'
      "fromDate":moment(this.fromDate).format("YYYY-MM-DD"),
      "toDate":moment(this.toDate).format("YYYY-MM-DD"),
      "sportId": parseInt(this.filterForm.value.sportId),
    }
    this._userSettingsService._getAccountStatementApi(payload).subscribe(
      (res:any)=>{
        this.accountStatement = res.accountStatement
        console.log(res);
      }
    );
  }

  // _getgameBySportId(){
  //   this._sharedservice._getSportsListApi().subscribe(
  //     (res:any)=>{
  //       this.sportslist = res;
  //       console.log(res);
  //     })
  // }

  next(): void {
    this.currentPage++;
    this.getAccountStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getAccountStatement();
  }

}
