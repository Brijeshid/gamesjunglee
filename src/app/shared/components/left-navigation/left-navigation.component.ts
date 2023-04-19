import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {

  mainMenu:any = [];
  viewMoreNavList:any = [];

  isLoggedIn:boolean = false;
  sportsName:string;
  userDetails:any;

  menuList:any;
  tourId:any;
  matchId:any;
  isMobileView:boolean;

  constructor(
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _location: Location,
  ) { }

  ngOnInit(): void {
    console.log("hello");
    this.isMobileViewCallInit();
    this._route.params.subscribe((routeParams)=>{
      this.sportsName = routeParams.sports;
      // this.sportsName = 'Cricket';
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;

      if(this.sportsName){
        this.matchId ? this.getSubNavBySportsWithTourAndMatchList()
                    : this.tourId ? this.getSubNavBySportsWithTourList() : this.getSubNavBySportsList();
      }else{
        this.getNavList();
        this.getSubNavList();
      }

    })
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }

  getSubNavBySportsList(){
    this._sharedService._postTourListApi({name:this.sportsName}).subscribe((tourListRes:any)=>{
      console.log('subNavList',tourListRes);
      if(tourListRes?.length >0){
        let updatedTourList = tourListRes.map((singleObj:any)=>(
          {
            'id':singleObj['tournamentId'],
            'name':singleObj['tournamentName']
          }
        ));
        this.menuList = updatedTourList;
      }
    });
  }

  getSubNavBySportsWithTourList(){
    this._sharedService._getToursMatchesListApi(this.tourId).subscribe((matchListRes:any)=>{
      console.log('subNavList',matchListRes);
      if(matchListRes?.length >0){
        let updatedMatchList = matchListRes.map((singleObj:any)=>(
          {
            'id':singleObj['matchId'],
            'refTournamentId':singleObj['refTournamentId'],
            'name':singleObj['matchName']
          }
        ));
        this.menuList = updatedMatchList;
      }
    });
  }

  getSubNavBySportsWithTourAndMatchList(){
    this._sharedService._getToursMatchesListApi(this.tourId).subscribe((matchListRes:any)=>{
      console.log('subNavList',matchListRes);
      if(matchListRes?.length >0){
        let updatedMatchList = matchListRes.map((singleObj:any)=>(
          {
            'id':singleObj['matchId'],
            'refTournamentId':singleObj['refTournamentId'],
            'name':singleObj['matchName']
          }
        ));
        this.menuList = updatedMatchList;
      }
    });
  }


  getNavList(){
    this._sharedService._getSportsListApi().subscribe((res)=>{
      //console.log('sportslist',res);
      this.mainMenu = res;
    });
  }
  getSubNavList(){
    this._sharedService._getAllNavListApi().subscribe((res)=>{
      this.viewMoreNavList = res['menuList'];
      //console.log(res);
    });
  }

  goBack(){
    this._location.back();
  }

}
