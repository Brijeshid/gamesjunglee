import { Component, OnInit } from '@angular/core';
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
  realDataWebSocket: any;

  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._sharedService.sharedSubject.subscribe((res:any)=>{
       this.isblur=res['isShowRightSideBar'];
       console.log(res['isShowRightSideBar'])
    })

    this._sharedService.getUserAdminPubSubApi().subscribe(
      (res: any) => {
        var currentUserDetails:any;
        currentUserDetails = this._sharedService.getUserDetails();
        currentUserDetails.isActive = "Inactive";
        console.log('user',currentUserDetails);
        console.log('getUserAdminPubSubApi', res);
        console.log('localstorage',localStorage.getItem('userDetails'));
        if (res) {
          this.realDataWebSocket = webSocket(res['url']);
          this.realDataWebSocket.subscribe(
            data => {
              console.log('realDataWebSocket',data);
              if(data.message == "STATUS_CHANGED" && currentUserDetails.userId == data.userId){
                if(data.status == 'Inactive'){
                  localStorage.setItem('userDetails',JSON.stringify(currentUserDetails));
                  currentUserDetails = this._sharedService.getUserDetails();
                  console.log('updated_user',currentUserDetails);
                  window.location.reload();
                }
                if(data.status == 'Closed'){
                  this._sharedService.removeJWTToken();
                  this._sharedService.removeUserDetails();
                  this._router.navigate(['/login']);
                }
              }
            }, // Called whenever there is a message from the server.
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
          );
        }
    });

  }

}

