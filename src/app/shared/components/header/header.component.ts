import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
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
  searchText = ''

  constructor(
    private _sharedService: SharedService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.isMobileViewCallInit();
    this.isLoggedIn = this._sharedService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUserBalance();
      this._sharedService.getUserBalance.subscribe(res => {
        this.getUserBalance();
      });
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
    console.log(searchText)
    console.log('keypress')
    this._sharedService._postSearchListApi({ "searchText": searchText })
      .subscribe((res) => {
        this.searchList = res;
        // console.log('res_data',res);
        if(!this.searchText){
          this.searchList = [];
        }
      })
  }
  emptySearchList() {
    this.searchList = [];
    // event.target.value = ""
    this.searchText = ""
  }

  // Refresh

  refreshPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
  }

  navigateToMatch(singleObj){
    // "/sportsbook/{{
    //   singleObj['sportType']['sportName'] | titlecase
    // }}/{{ singleObj['tournament']['tournamentId'] }}/{{
    //   singleObj['matchId']
    // }}"
    console.log(singleObj)
    this.router.navigate(['sportsbook/'+ singleObj['sportType']['sportName'] +'/' + singleObj['tournament']['tournamentId'] + '/' + singleObj['matchId'] ])
    this.emptySearchList()
  }
}
