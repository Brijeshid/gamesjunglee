import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})

export class ProfitLossComponent implements OnInit {
  betsPnl: any[] = [];
  currentBet:any = null;

  constructor(private _userSettingsMainService: UserSettingsMainService,
    private _location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    var matchId = this.route.snapshot.paramMap.get('matchId');
    var obj = { matchId: Number(matchId) }
    this._userSettingsMainService._getBetHistoryForUserAccountStatementApi(obj).subscribe(
      (res: any) => {
        this.currentBet = res.betHistoryList;
        this.betsPnl = res.betHistoryList.bets;
      });

    //this.currentBet = this._userSettingsMainService.getPlBets();
    //this.betsPnl = this.currentBet.bets;
    //console.log(this.currentBet);
    //console.log('pnlll',this.betsPnl);
  }

  goBack() {
    this._location.back();
  }

}
