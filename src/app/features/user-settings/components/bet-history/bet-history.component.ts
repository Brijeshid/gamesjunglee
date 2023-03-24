import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss']
})
export class BetHistoryComponent implements OnInit {

  allSports: any;
  limit:number = 25;
  betHistoryStatus:string = 'Matched';
  isLoading = false;
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 0;
  betHistory: any;
  betHistoryForm: FormGroup;
  isMatched:Boolean = true;
  isDeleted:Boolean = false;
  betHistoryList:any = {};
  options: any = {
    autoApply: false,
    clickOutsideAllowed: false,
    // displayFormat?: string;
    disabled: true,
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
    private _sharedService: SharedService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
    this.getSports();
    this.createBetHistoryForm();
    this.getBetHistoryForUser();
  }

  rangeSelected(event) {
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  getSports() {
    this._sharedService._getSportsListApi().subscribe((res: any) => {
      this.allSports = res;
    });
  }

  getBetHistoryForUser() {
    this.isLoading = true;
    this.betHistoryStatus = this.betHistoryForm.value.status;
    var userDetails = this._sharedService.getUserDetails();
    if(this.betHistoryForm.value.status == 'Matched'){
      this.isMatched = true;
      this.isDeleted = false;
    } else {
      this.isMatched = false;
      this.isDeleted = true;
    }
    let body = {
      "userId": userDetails.userId,
      "fromDate":moment(this.fromDate).format("YYYY-MM-DD"),
      "toDate":moment(this.toDate).format("YYYY-MM-DD"),
      "sportId": parseInt(this.betHistoryForm.value.sportId),
      "isMatched": this.isMatched,
      "isDeleted": this.isDeleted,
      "pageNo": this.currentPage,
      "limit": this.limit
    };
    this._userSettingsService._getBetHistoryForUserApi(body).subscribe((res: any) => {
      this.betHistoryList = res.betHistoryList;
      this.isLoading = false;
      this.totalPages = Math.ceil(this.betHistoryList.length / this.pageSize);
    });
  }

  updateLimit(event){
    this.limit = parseInt(event.target.value);
    this.getBetHistoryForUser();
  }
  createBetHistoryForm() {
    this.betHistoryForm = this._fb.group({
      sportId: [4, [Validators.required]],
      status: ['Matched', [Validators.required]]
    })
  }


  next(): void {
    this.currentPage++;
    this.getBetHistoryForUser();
  }

  prev(): void {
    this.currentPage--;
    this.getBetHistoryForUser();
  }


}
