import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss']
})
export class LeaguesComponent implements OnInit {

  @Input() leaguesList:any = [];
  sportsName:string;
  constructor(
    private _router: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.sportsName = this._router.snapshot.params.sports;
  }

}
