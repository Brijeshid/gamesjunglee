import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthMainComponent } from './components/auth-main/auth-main.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

const routes: Routes = [
  {
    path:'',
    component:AuthMainComponent,
    children:[
      {path:'login', component:LoginComponent},
      {path:'registration', component:RegistrationComponent},
      {path:'', redirectTo:'/login', pathMatch:'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
