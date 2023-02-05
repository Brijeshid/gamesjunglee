import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {

  isLoggedIn:boolean = false;
  sportsName:string;
  userDetails:any;

  @Input() menuList:any;

  constructor(
    private _router: ActivatedRoute,
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.sportsName = this._router.snapshot.params.sports;
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
  }

}
