import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userConfig:any=[];
  oneClickBetting:boolean=true;
  accountBtn = "Edit";
  editBetting:FormArray;
  editBettingEditStake:FormArray;
  isEditMode = false;
  isEditMode1 = false;
  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private _location: Location,

    ) { }
    
    onActivateAll(){
      this.oneClickBetting=!this.oneClickBetting;
    }
    
  
  ngOnInit(): void {
    this.getUserConfig();
    this._userSettingsService._getUserConfigApi().subscribe(
      (res:any) => {
        if(res?.userConfig){
          this.userConfig = res;
          this.editBetting=new FormArray(res['userConfig']['editOneClickStakeBtn'].map(_singleValue=>new FormControl(_singleValue)))
          this.editBettingEditStake=new FormArray(res['userConfig']['EditStakesBtn'].map(_singleValue1=>new FormControl(_singleValue1)))
        }
      });
  }

  getControl(index){
    return this.editBetting.at(index) as FormControl
  }
  
  getControl1(index){
    return this.editBettingEditStake.at(index) as FormControl
  }

  getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res  ;
      });
  }


  onSubmitSave(){
    let saveUser = {
      userConfig:{
        EditStakesBtn:[...this.editBettingEditStake.value],
        onClickBettingStatus:true,
        editOneClickStakeBtn:[...this.editBetting.value],
        editOneClickStakeActiveBtn:49996
      }
    }
    this._userSettingsService._getSaveUserConfigApi(saveUser).subscribe(
      (res) => {
        this.userConfig = res  ;      
      });
      this._sharedService.getToastPopup("User Settings saved sucessfully",'Settings','success');

    }
    
    goBack(){
      this._location.back();
    }
}
