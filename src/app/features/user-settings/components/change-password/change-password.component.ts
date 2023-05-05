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
  changePasswordForm!: FormGroup;
  clickMessage : any;
  show: boolean = false;
  show1: boolean = false;
  show2: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private _SettingsService: UserSettingsMainService,
    private _sharedService: SharedService,
    private _router: Router) { 
      this.changePasswordForm = this.formbuilder.group({
        oldPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        newPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c),Validators.pattern(
          "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
              )]),
        confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),  
    },
    {

      validators: this.Mustmatch('newPassword', 'confirmPassword')
    }
  )
}
get f() {
  return this.changePasswordForm.controls;
}

  ngOnInit(): void {
  }

  loginuser() {
    if (confirm('Are you sure you want to Update Password?\n or\nYou need to Stay Here')) {

      let changePwdData = {
        oldPassword: this.changePasswordForm.controls['oldPassword'].value,
        newPassword: this.changePasswordForm.controls['newPassword'].value,
      }
      this._SettingsService._postChangePasswordApi(changePwdData).subscribe((res) => {
        console.log("pwd Changed", res);
        this._sharedService.getToastPopup('Password Changed Successfully', 'Password Change', 'success');
      })

      console.warn(this.changePasswordForm.value);
    }
  }
  get oldPasswordVail() {
    return this.changePasswordForm.get('oldPassword')
  }


  get newPasswordVail() {
    return this.changePasswordForm.get('newPassword')
  }

  get confirmPasswordVail() {
    return this.changePasswordForm.get('confirmPassword')
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

  onClickMe(){
    this.clickMessage = '● Password must be min of 8 characters and max of 20 \n ● It should contain \n 1 aplha-numeric character   \n  1 upper case character   \n 1 lower case character   \n 1 special character';
  }

}
