import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showRightSidebar: boolean = false;
  isLoggedIn:boolean = false;
  isShowRightSideBar:boolean = false;
  
  userBalance:any;
  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.getUserBalance();
  }

  getRightSidebarEvent(eventObj){
    this.isShowRightSideBar = !eventObj['isClose'];
  }

  getUserBalance(){
    this._sharedService._getBalanceInfoApi().subscribe((res)=>{
      this.userBalance = res;
      console.log('res_data',res);
    })
  }

  

}
