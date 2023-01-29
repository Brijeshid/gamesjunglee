import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '@config/constant';

@Injectable()
export class SubscriptionTokenInterceptor implements HttpInterceptor {

  constructor(
    private _constants: Constants
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let globalHeaders = {
      'Ocp-Apim-Subscription-Key':this._constants.API_OCP_APIM_SUBSCRIPTION_KEY,
      'Junglee-Token':this._constants.API_JUNGLEE_TOKEN
    };

    const subHeaderRequest = request.clone({
      headers: new HttpHeaders(globalHeaders)
    })
    return next.handle(subHeaderRequest);
  }
}
