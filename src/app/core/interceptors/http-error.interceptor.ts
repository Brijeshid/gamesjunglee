import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
//for catch:
import { catchError, finalize } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from '@config/constant';
import * as _ from "lodash";
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService,
    private _ngxLoader:NgxUiLoaderService,
    private _constant:Constants,
    private _router:Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.isLoaderActivate(request) ? this._ngxLoader.start() :this._ngxLoader.stop();
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        // console.log('hello',err);
        if(err['status'] === 401){
          this._sharedService.removeJWTToken();
          this._router.navigate(['/home'])
        }
        if(err['error'] !== null){
          this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
        }else{
          this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
        }
        return EMPTY;
      }),
      finalize(()=>{
        this.isLoaderActivate(request) ? this._ngxLoader.stop() :this._ngxLoader.stop();
      })
    );
  }

  isLoaderActivate(request){
    var text = request['url'];
    var values = [
      this._constant.API_ENDPOINT+'/'+this._constant.API_URL_SPORTS_TOURNAMENT,
      this._constant.API_ENDPOINT+'/'+this._constant.API_URL_TOURNAMENT_MATCHES,
       ];
    if(_.some(values, (el) => _.includes(text, el))){
      return false;
    }else{
      return true;
    }
  }
}
