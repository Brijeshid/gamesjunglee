import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-rules-regulations',
  templateUrl: './rules-regulations.component.html',
  styleUrls: ['./rules-regulations.component.scss']
})
export class RulesRegulationsComponent implements OnInit {

  termCond:any;
  constructor(
    private _userSettingsService: UserSettingsMainService
  ) { }

  ngOnInit(): void {
    this.getTermCond();
  }

  getTermCond(){
    this._userSettingsService._getTermCondApi().subscribe(
      (res)=>{
        this.termCond = res['termsAndCondition'];
        console.log(res);
      }
    );
  }

}
