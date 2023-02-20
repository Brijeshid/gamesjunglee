import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-match-name-pl',
  templateUrl: './match-name-pl.component.html',
  styleUrls: ['./match-name-pl.component.scss']
})
export class MatchNamePlComponent implements OnInit {

  betsPnl :any[] = [];
  currentBet:any = null;

  constructor(private _userSettingsMainService:UserSettingsMainService) { }

  ngOnInit(): void {
    this.currentBet = this._userSettingsMainService.getPlBets();
    this.betsPnl = this.currentBet.bets;
    console.log(this.currentBet)
    console.log('pnl',this.betsPnl)
  }

}
