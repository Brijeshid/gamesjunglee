import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  show: boolean = false;
  isLoading:boolean = false;
  button = 'LOGIN';

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  private _preConfig() {
    this._createSignInForm();
  }

  _createSignInForm(){
    this.signInForm = this._fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onSubmitSignIn(){
    console.log(this.signInForm.value);
    this.isLoading = true;
    let loginData = {
      username: this.signInForm.value['username'],
      pwd: this.signInForm.value['password'],
      userIp:'',
      rememberme: true
    }

    this._sharedService.getIPApi().subscribe(res=>{
      loginData['userIp'] = res['ip'];
      this._authService._postLoginApi(loginData).subscribe(
        (res: any) => {
          this._sharedService.setJWTToken(res['token']);
          this._sharedService.setUserDetails(jwt_decode(res['token']));
          this._router.navigate(['/in-play'])
          console.log("hello",res);
        },
        (err) => {
          this.isLoading=false
          if(err['error'] !== null){
            this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
          }else{
            this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
          }
        },
        () => this.isLoading=false
        )
    },
    () => this.isLoading=false,
    () => this.isLoading=false
    )
    
  }

}
