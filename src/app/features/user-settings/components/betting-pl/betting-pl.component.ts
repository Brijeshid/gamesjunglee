import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-betting-pl',
  templateUrl: './betting-pl.component.html',
  styleUrls: ['./betting-pl.component.scss']
})
export class BettingPlComponent implements OnInit {
  profitLoss : any[] = [];
  

  constructor(
    private _userSettingsService: UserSettingsMainService,
  ) { }

  ngOnInit(): void {
    this.getProfitLoss()
  }

  getProfitLoss(){
    this._userSettingsService._getProfitLossApi().subscribe(
      (res:any) => { 
       this.profitLoss = res.profitLoss.reverse();
        console.log("getUser", res);
      }
    );
  }

}
