import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {

  accountStatement:any[] = [];
  filterForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  sportslist :any[]=[];

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _sharedservice: SharedService
  ) {
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      sportsId:new FormControl(null),
   })

  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  ngOnInit(): void {
    this.getAccountStatement();
    this. _getgameBySportId()
  }


  getAccountStatement(){
    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    const payload = {
      // fromDate : "Sun Jan 01 2023 00:00:00 GMT+0530 (India Standard Time)",
      // toDate : "Sun Mar 31 2023 00:00:00 GMT+0530 (India Standard Time)",
      // sportId : '4'
      fromDate: fromDate,
      toDate: toDate,
      sportsId:this.filterForm.value.sportsId,
    }
    this._userSettingsService._getAccountStatementApi(payload).subscribe(
      (res:any)=>{
        this.accountStatement = res.accountStatement
        console.log(res);
      }
    );
  }

  _getgameBySportId(){
    this._sharedservice._getSportsListApi().subscribe(
      (res:any)=>{
        this.sportslist = res;
        console.log(res);
      })
  }

}
