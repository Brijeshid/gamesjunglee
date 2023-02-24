import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn:boolean = false;
  isShowRightSideBar:boolean = false;
  searchList:any = [];
  userBalance:any;

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    if(this.isLoggedIn)this.getUserBalance();
    this._sharedService.getUserBalance.subscribe(res =>{
      this.getUserBalance();
    })
  }

  getRightSidebarEvent(eventObj){
    this.isShowRightSideBar = !eventObj['isClose'];
  }

  onClickAvailableCredit(){
    this.isShowRightSideBar=!this.isShowRightSideBar;
    this._sharedService.sharedSubject.next({
      'isShowRightSideBar':this.isShowRightSideBar
    });

  }

  getUserBalance(){
    this._sharedService._getBalanceInfoApi().subscribe((res)=>{
      this.userBalance = res;
      console.log('res_data',res);
    })
  }

  postSearchList(searchText:any){
    this._sharedService._postSearchListApi({"searchText":searchText})
    .subscribe((res)=>{
      this.searchList = res;
      console.log('res_data',res);
    })
  }

  // Refresh

  refreshPage(){
    window.location.reload();
  }
}
