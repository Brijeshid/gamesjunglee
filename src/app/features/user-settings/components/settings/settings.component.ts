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
  isLoading = false;
  editOneClickStakeActiveBtn : any;

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private _location: Location,

    ) { }

    onActivateAll(){
      this.oneClickBetting=!this.oneClickBetting;
    }


  ngOnInit(): void {console.log(this.isLoading,'this.isLoading start');
    //this.getUserConfig();
    this.isLoading = true;
    this._userSettingsService._getUserConfigApi().subscribe(
      (res:any) => {
        if(res?.userConfig){
          this.userConfig = res;
          this.editBetting=new FormArray(res['userConfig']['editOneClickStakeBtn'].map(_singleValue=>new FormControl(_singleValue)));
          this.editBettingEditStake=new FormArray(res['userConfig']['EditStakesBtn'].map(_singleValue1=>new FormControl(_singleValue1)));
          this.isLoading = false;
          this.editOneClickStakeActiveBtn = res.userConfig.editOneClickStakeActiveBtn;
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
      (res:any) => {
        this.userConfig = res  ;
        this.editOneClickStakeActiveBtn = res.userConfig.editOneClickStakeActiveBtn;
        console.log(res)
      });
  }


  onSubmitSave(){
    let saveUser = {
      userConfig:{
        EditStakesBtn:[...this.editBettingEditStake.value],
        onClickBettingStatus:true,
        editOneClickStakeBtn:[...this.editBetting.value],
        editOneClickStakeActiveBtn:this.editOneClickStakeActiveBtn
      }
    }
    this._userSettingsService._getSaveUserConfigApi(saveUser).subscribe(
      (res) => {
        this.userConfig = res  ;
        this.getUserConfig();
      });
      this._sharedService.getToastPopup("User Settings saved sucessfully",'Settings','success');

    }

    goBack(){
      this._location.back();
    }

    setOneClickActiveBtn(activeBtn){
      console.log(activeBtn)
      this.editOneClickStakeActiveBtn = activeBtn;
      this.onSubmitSave();
    }
}
