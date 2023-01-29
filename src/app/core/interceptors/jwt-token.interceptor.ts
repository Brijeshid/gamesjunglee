import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '@shared/services/shared.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(this._sharedService.getJWTToken() !== null && request['url'] !== "/api/import_multi_market"){
      let jwtTokenHeader = {
        'Authorization':'Bearer '+ this._sharedService.getJWTToken()
      };
      const reqWithHeader = request.clone({
        setHeaders: jwtTokenHeader
      })
      return next.handle(reqWithHeader);
    }else{
      return next.handle(request);
    }
    
  }
}
