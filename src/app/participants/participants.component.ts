import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { Network } from '@ngx-pwa/offline';

import { Observable } from 'rxjs';
import { Participant } from "./participants";
import { ParticipantsService } from "./participants.service";
import { MatSnackBar } from '@angular/material';

import { NativeDateAdapter, DateAdapter,MAT_DATE_FORMATS } from '@angular/material';
import { formatDate } from '@angular/common';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { TripService } from "../trip/trip.service";

export const PICK_FORMATS = {
  parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
  display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'}
  }
};

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'MM/dd/yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css'],
  providers: [
    {provide: DateAdapter, useClass: PickDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS}
    ]
})

export class ParticipantsComponent implements OnInit {

  networkStatus$
  checked = true;
  participants = [];
  displayedColumns: string[] = ['name', 'screen', 'action'];
  dataSource = new MatTableDataSource<Participant>(this.participants);

  participants$: Observable<Participant[]>;
  isInteractionStarted: boolean = false;
  sel_participant = "";
  loading :boolean =  true;

  date = new FormControl(new Date());
  sel_date = "";
  surveys = [];
  sel_trip = "" ;
  trip_object = {};

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private authService: AuthService
    protected network: Network,
    private participantsService: ParticipantsService,
    private snackBar: MatSnackBar,
    private tripService: TripService,
  ) {
    this.networkStatus$ = this.network.onlineChanges;
  }

  ngOnInit() {
    this.sel_trip = this.route.snapshot.paramMap.get("tripid");

    this.tripService.getSelTrip().subscribe(
      (data) => {
        if(data)
          this.trip_object = data;
        else
          this.router.navigate(["/trips"]);
      }
    );

    this.participants$ = this.participantsService.getParticipants(this.sel_trip);
    let self = this;
    this.sel_date = this.getDateString(new Date());
    this.participants$.subscribe({ 
      next(values) {
        self.loading = false;
        self.participants = values;
        self.loadTable();
      } 
    })
    this.getSurveys();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  loadTable(){
    this.dataSource =  new MatTableDataSource<Participant>(this.participants);
    this.dataSource.sort = this.sort;
    
  }
  getFullname(element){
    return element.firstname + " " + element.middlename + " " + element.lastname;
  }

  getDateString(newDate){
    return ('0' + (newDate.getMonth()+1)).slice(-2) + '/' + ('0' + newDate.getDate()).slice(-2) + '/' + newDate.getFullYear();
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let newDate = new Date(event.value);
    this.sel_date = this.getDateString(newDate)
  }

  onSurveyClicked(element){
    this.participantsService.addSelParticipants(element)
    this.participantsService.addSelDate(this.sel_date)
    this.router.navigate(["/survey"]);
  }

  getSurveys(){
    this.participantsService.getSurveys().subscribe(
      (data) => {
        if(data){
          this.surveys = data;
          console.log("surveys",this.surveys)
        }
        else
          this.surveys = [];
      }
    )
  }
  checkSurveyStatus(user){
    let existing = this.surveys.filter((item) => {
      return item['userID'] == user['userID'] && item["timestamp"] == this.sel_date && item["tripID"] == this.sel_trip
    })
    if(existing.length > 0){
      return true;
    }else{
      return false;
    }
  }
}
