import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  signUpForm: FormGroup;
  isLoading:boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  private _preConfig() {
    this._createSignUpForm();
  }

  _createSignUpForm(){
    this.signUpForm = this._fb.group({
      name:['',Validators.required],
      phoneNo:['',[Validators.required,Validators.pattern("^[0-9]*$"),
      Validators.minLength(10), Validators.maxLength(10)]]
    })
  }

  onSubmitSignUp(){
    console.log(this.signUpForm.value);
    this.isLoading = true;
    let signData = {
      name: this.signUpForm.value['name'],
      mobileNo: this.signUpForm.value['phoneNo'],
    }

    this._authService._postSignupApi(signData).subscribe((res) => {
      this.isLoading=false;
      this._sharedService.getToastPopup('You have Successfully Registered','Registration','success');
      console.log("registered", res);
      this.signUpForm.reset();
    }),
    () => this.isLoading=false,
    () => this.isLoading=false
  }

}
