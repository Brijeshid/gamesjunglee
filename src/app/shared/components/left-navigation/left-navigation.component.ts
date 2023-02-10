import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {

  isLoggedIn:boolean = false;
  sportsName:string;
  userDetails:any;

  menuList:any;
  tourId:any;
  matchId:any;

  constructor(
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe((routeParams)=>{
      this.sportsName = routeParams.sports;
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;
      
      if(this.sportsName){
        this.matchId ? this.getSubNavBySportsWithTourAndMatchList() 
                    : this.tourId ? this.getSubNavBySportsWithTourList() : this.getSubNavBySportsList();
      }
      
    })
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
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

}
