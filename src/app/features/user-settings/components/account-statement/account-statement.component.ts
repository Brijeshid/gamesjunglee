import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import * as moment from 'moment';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {
  // allSports: any;
  limit:number = 25;
  searchTerm: string = '';
  accountStatement: any = {};
  filterForm: FormGroup;
  isLoading = false;
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 0;
  sportslist: any[] = [];
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
  fromDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  toDate = moment().format("YYYY-MM-DD");

  toDateInit = moment().format("DD MMM YYYY")
  fromDateInit = moment(this.toDateInit).subtract(1, 'months').format("DD MMM YYYY")
  @ViewChild('dateRangePicker') dateRangePicker: ElementRef;
  preDefineDateRange = this.fromDateInit + ' - ' + this.toDateInit;

  fileName = 'AccountStatement.xlsx';

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _sharedservice: SharedService,
    private _fb: FormBuilder,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  ngAfterViewInit() {
    this.dateRangePicker['range'] = this.preDefineDateRange  //"13 Apr 2023 - 17 Apr 2023"
    this.cdr.detectChanges();
  }

  _preConfig() {
    this.getSports();
    this.createAccountStatementForm();
    this.getAccountStatement();
  }
  openProfitLoss(matchId) {
    if (matchId) {
      this.router.navigate(['/account-statement/profit-loss/'+matchId]);
    }
  }

  rangeSelected(event) {
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  getSports() {
    // this._sharedservice._getSportsListApi().subscribe((res: any) => {
    //   this.allSports = res;
    // });
  }

  getAccountStatement() {
    this.isLoading = true;
    const payload = {
      fromDate: moment(this.fromDate).format("YYYY-MM-DD HH:mm:ss"),
      toDate: moment(this.toDate).set({ hour: 23, minute: 59, second: 59 }).format("YYYY-MM-DD HH:mm:ss"),
      "sportId": parseInt(this.filterForm.value.sportId),
      "pageNo": this.currentPage,
      "limit": this.limit,
      "searchName": this.searchTerm
    };
    this._userSettingsService._getAccountStatementApi(payload).subscribe(
      (res: any) => {
        this.accountStatement = res.accountStatement;
        this.isLoading = false;
        this.totalPages = Math.ceil(this.accountStatement.length / this.pageSize);
        console.log(res);
      }
    );
  }

  search(): void {
    // this.getAccountStatement();
  }

  updateLimit(event) {
    this.limit = parseInt(event.target.value);
    this.getAccountStatement();
  }

  createAccountStatementForm() {
    this.filterForm = this._fb.group({
      sportId: [4, [Validators.required]],
      search: ''
    })
  }

  next(): void {
    this.currentPage++;
    this.getAccountStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getAccountStatement();
  }

  goBack() {
    this._location.back();
  }

  exportExcel() {
    this._sharedservice.exportExcel(this.accountStatement, this.fileName);
  }


}
