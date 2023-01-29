import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {

  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLoggedIn = this._sharedService.getJWTToken();
      if(isLoggedIn){
        this._router.navigate(['/dashboard'])
        return false
      } else {
          return true
      }
  }
  
}
