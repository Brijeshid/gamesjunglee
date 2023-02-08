import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {
  tranState: any;
 
  constructor(
    private _userSettingsService: UserSettingsMainService

  ) { }

  ngOnInit(): void {
    this.getTransferStatement();
  }


  getTransferStatement() {
    this._userSettingsService._getTransferStatementApi().subscribe(
      (res) => {
        this.tranState = res;
       
        console.log("transfer", this.tranState);
      }
    );
  }
}
