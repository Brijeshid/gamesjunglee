import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  mainMenu:any = [];
  viewMoreNavList:any = [];
  isLoggedIn:boolean = false;
  userDetails:any;
  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
    this.getNavList();
    this.getSubNavList();
  }

  getNavList(){
    this._sharedService._getSportsListApi().subscribe((res)=>{
      console.log('sportslist',res);
      this.mainMenu = res;
    });
  }
  getSubNavList(){
    this._sharedService._getAllNavListApi().subscribe((res)=>{
      this.viewMoreNavList = res['menuList'];
      console.log(res);
    });
  }



}
