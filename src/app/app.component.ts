import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'gamesjunglee';
  isblur:any = false;
  deviceInfo:any;

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._sharedService.sharedSubject.subscribe((res:any)=>{
       this.isblur=res['isShowRightSideBar'];
       console.log(res['isShowRightSideBar'])
    })
    this._sharedService.setDeviceDetails();
  }

}

