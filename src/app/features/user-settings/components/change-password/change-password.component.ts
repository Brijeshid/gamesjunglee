import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { stringify } from 'querystring';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  title = 'changePassword';
  changepasswordform!: FormGroup;
  constructor(private formbuilder: FormBuilder,
    private _SettingsService: UserSettingsMainService,
    private _sharedService: SharedService,
    private _router: Router) { 
      this.changepasswordform = this.formbuilder.group({
        oldPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        newPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),  
    },
    {

      validators: this.Mustmatch('newPassword', 'confirmPassword')
    }
  )
}
get f() {
  return this.changepasswordform.controls;
}

  ngOnInit(): void {
  }

  loginuser() {
    if (confirm('Are you sure you want to Update Password?\n or\nYou need to Stay Here')) {

      let changePwdData = {
        oldPassword: this.changepasswordform.controls['oldPassword'].value,
        newPassword: this.changepasswordform.controls['newPassword'].value,
      }
      this._SettingsService._postChangePasswordApi(changePwdData).subscribe((res) => {
        console.log("pwd Changed", res);
        this._sharedService.getToastPopup('Password Changed Successfully', 'Password Change', 'success');
      })

      console.warn(this.changepasswordform.value);
    }
  }
  get oldPasswordVail() {
    return this.changepasswordform.get('oldPassword')
  }


  get newPasswordVail() {
    return this.changepasswordform.get('newPassword')
  }

  get confirmPasswordVail() {
    return this.changepasswordform.get('confirmPassword')
  }


  Mustmatch(newPassword: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const newPasswordcontrol = formGroup.controls[newPassword];
      const confirmPasswordcontrol = formGroup.controls[confirmPassword];

      if (confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']) {
        return;
      }
      if (newPasswordcontrol.value !== confirmPasswordcontrol.value) {
        confirmPasswordcontrol.setErrors({ Mustmatch: true });
      }
      else {
        confirmPasswordcontrol.setErrors(null);
      }
    }
  };

}
