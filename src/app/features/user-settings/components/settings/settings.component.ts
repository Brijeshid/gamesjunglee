import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from '../../services/user-settings-main.service';

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
    private _sharedService: SharedService

    ) { }
    
    onActivateAll(){
      this.oneClickBetting=!this.oneClickBetting;
      console.log(this.oneClickBetting);
    }
    
  
  ngOnInit(): void {
    this.getUserConfig()

    this._userSettingsService._getUserConfigApi().subscribe(
      (res:any) => {
        if(res?.userConfig){
          this.userConfig = res;

          this.editBetting=new FormArray(res['userConfig']['editOneClickStakeBtn'].map(_singleValue=>new FormControl(_singleValue)))
          this.editBettingEditStake=new FormArray(res['userConfig']['EditStakesBtn'].map(_singleValue1=>new FormControl(_singleValue1)))

         
          console.log("getUser", this.userConfig);
        }
       
      }
    );

    // if(this.userConfig){
    //     this.isEditMode = true;
    //   }
  }

  getControl(index)
  {
    console.log(this.editBetting.value.at(index),'Event')
    return this.editBetting.at(index) as FormControl
  }
  
  getControl1(index)
  {
    console.log(this.editBettingEditStake.at(index),'Event')
    return this.editBettingEditStake.at(index) as FormControl
  }

  getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this.userConfig = res  ;
       
        console.log("getUser", this.userConfig.userConfig.editOneClickStakeBtn[0]);
      }
    );
    
  }


  onSubmitSave(){
    let saveUser = {
      // ...this.editBetting.value,
      // editOneClickStakeBtn : ["9999", "49996", "100000", "10000", "10000", "10000"],
      // EditStakesBtn:["10000", "50000", "100000", "10000", "10000", "30000"]

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
        console.log("saveUser", this.userConfig);

        }
      );
    console.log('save',saveUser)
    }
}
