import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';


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
  realDataWebSocket: any;



  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    if(this.isLoggedIn){
      this.getUserBalance();
      this._sharedService.getUserBalance.subscribe(res =>{
        this.getUserBalance();
      });
      
      this._sharedService.getUserAdminPubSubApi().subscribe(
        (res: any) => {
          var messages = ["WINNINGS_ADJUSTED","EDIT_USER","BET_DELETED_BY_ADMIN","RESULT_OUT"];
          var currentUserDetails:any;
          currentUserDetails = this._sharedService.getUserDetails();
          if (res) {
            this.realDataWebSocket = webSocket(res['url']);
            this.realDataWebSocket.subscribe(
              data => {
                console.log('realDataWebSocket',data);
                if(messages.indexOf(data.message) !== -1 && currentUserDetails.userId == data.userId){
                  this.getUserBalance();
                }
              }, // Called whenever there is a message from the server.
              err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
              () => console.log('complete') // Called when connection is closed (for whatever reason).
            );
          }
      });
    }

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
      //console.log('res_data',res);
    })
  }

  postSearchList(searchText:any){
    this._sharedService._postSearchListApi({"searchText":searchText})
    .subscribe((res)=>{
      this.searchList = res;
      //console.log('res_data',res);
    })
  }
  emptySearchList(event){
    this.searchList = [];
    event.target.value = ""
  }

  // Refresh

  refreshPage(){
    window.location.reload();
  }
}
