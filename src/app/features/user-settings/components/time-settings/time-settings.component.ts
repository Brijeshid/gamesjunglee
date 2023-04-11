import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'app-time-settings',
  templateUrl: './time-settings.component.html',
  styleUrls: ['./time-settings.component.scss']
})
export class TimeSettingsComponent implements OnInit {

  constructor(    private _location: Location,
    ) { }

  ngOnInit(): void {
  }

  goBack(){
    this._location.back();
  }

}
