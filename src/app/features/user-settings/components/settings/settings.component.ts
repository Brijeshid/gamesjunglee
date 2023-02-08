import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userConfig:any;
  oneClickBetting:boolean=true;
  constructor(
    private _userSettingsService: UserSettingsMainService

    ) { }
    
    onActivateAll(){
      this.oneClickBetting=!this.oneClickBetting;
      console.log(this.oneClickBetting);
    }
    
  
  ngOnInit(): void {
    this.getUserConfig()

  }
  getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res  ;
       
        console.log("getUser", this.userConfig);
      }
    );
  }


}
