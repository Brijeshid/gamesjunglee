import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {

  @Input() userBalance:any;
  @Output() rightSidebarEvent: EventEmitter<any> = new EventEmitter();
  userDetails:any;
  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.userDetails = this._sharedService.getUserDetails();
  }

  onClose(){
    this.rightSidebarEvent.emit({isClose:true});
  }

  onLogout(){
    this._sharedService.removeJWTToken();
    this._sharedService.removeUserDetails();
    this._router.navigate(['/login']);
  }

}
