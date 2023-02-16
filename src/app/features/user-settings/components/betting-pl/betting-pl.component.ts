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
    // private _userSettingsService:UserSettingsDataService
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

  setPlBet(bets){
    console.log(bets)
    this._userSettingsService.setPlBets(bets)
    console.log('res',bets)
  }

}
