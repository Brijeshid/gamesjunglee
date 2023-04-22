import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  isShowRightSideBar: boolean = false;
  searchList: any = [];
  userBalance: any;
  isMobileView: boolean;
  isShowLeftSideBar: boolean = false;
  private destroy = new Subject();

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isMobileViewCallInit();
    this.isLoggedIn = this._sharedService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUserBalance();
      this._sharedService.getUserBalance.pipe(
        takeUntil(this.destroy)     // import takeUntil from rxjs/operators.
         ).subscribe(res => {
        console.log('subscribe', res);
        this.getUserBalance();
      })
    ;
    }
  }

  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })
  }

  getRightSidebarEvent(eventObj) {
    this.isShowRightSideBar = !eventObj['isClose'];
  }

  getLeftSidebarEvent(eventObj) {
    this.isShowLeftSideBar = !eventObj['isClose'];
  }


  onClickAvailableCredit() {
    this.isShowRightSideBar = !this.isShowRightSideBar;
    this._sharedService.sharedSubject.next({
      'isShowRightSideBar': this.isShowRightSideBar
    });

  }

  onLeftClick() {
    this.isShowLeftSideBar = !this.isShowLeftSideBar;
    this._sharedService.sharedSubject.next({
      'isShowLeftSideBar': this.isShowLeftSideBar
    });

  }

  getUserBalance() {
    this._sharedService._getBalanceInfoApi().subscribe((res) => {
      this.userBalance = res;
      this._sharedService.userBalance = res;
    })
  }

  postSearchList(searchText: any) {
    this._sharedService._postSearchListApi({ "searchText": searchText })
      .subscribe((res) => {
        this.searchList = res;
        //console.log('res_data',res);
      })
  }
  emptySearchList(event) {
    this.searchList = [];
    event.target.value = ""
  }

  // Refresh

  refreshPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.destroy.next();
  }
}
