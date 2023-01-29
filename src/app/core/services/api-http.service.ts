import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {

  constructor(
    private _http: HttpClient
  ) { }

  public get(url:string,options?:any){
    return this._http.get(url,options);
  }

  public post(url:string,data:any,options?:any){
    return this._http.post(url,data,options);
  }

  public put(url:string,data:any,options?:any){
    return this._http.put(url,data,options);
  }

  public delete(url:string,options?:any){
    return this._http.delete(url,options);
  }

  public patch(url:string,data:any,options?:any){
    return this._http.patch(url,data,options);
  }

}
