import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { filter } from 'rxjs/operators';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-rules-regulations',
  templateUrl: './rules-regulations.component.html',
  styleUrls: ['./rules-regulations.component.scss']
})
export class RulesRegulationsComponent implements OnInit {

  termCond:any;
  previousUrl: string;

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _sharedservice: SharedService
  ) {}

  ngOnInit(): void {
    this.getTermCond();
    // this.goToPrevious();
  }

  getTermCond(){
    this._userSettingsService._getTermCondApi().subscribe(
      (res)=>{
        this.termCond = res['termsAndCondition'];
        console.log(res);
      }
    );
  }

  public goToPrevious()  {
    return this._sharedservice.getPreviousUrl();
    
    // if(previous != undefined)
    //   this._sharedservice.router.navigateByUrl(previous);

  }

}
