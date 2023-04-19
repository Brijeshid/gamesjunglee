import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'gamesjunglee';
  isblur:any = false;
  currentUserDetails:any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth <= 767){
      this._sharedService.isMobileView.next(true);
    }else{
      this._sharedService.isMobileView.next(false);
    }
  }
  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._sharedService.sharedSubject.subscribe((res:any)=>{
       this.isblur=res['isShowRightSideBar'];
       console.log(res['isShowRightSideBar'])
    })

    if(this._sharedService.isLoggedIn()){
      this._sharedService.getUserAdminPubSubApi().subscribe(
        (resObj: any) => {this._sharedService.getUserRealTimeEvent(resObj)}, // Called whenever there is a message from the server.
        err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
        () => console.log('complete') // Called when connection is closed (for whatever reason).
      );
    }
  }

  ngOnDestroy(): void {
   this._sharedService.unsubscribeWebSocket();
  }

}

