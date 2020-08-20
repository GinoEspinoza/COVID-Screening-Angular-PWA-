import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantsService } from "../participants/participants.service";
import { Survey } from '../participants/participants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TripService } from "../trip/trip.service";
import { EventEmitterService } from "../event-emitter.service";
import { Network } from '@ngx-pwa/offline';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  networkStatus$
  form: FormGroup;
  questions = [];
  sel_participant : {};
  surveys = [];
  existing_survey = null;
  sel_date = "";
  sel_trip = {};
  staffID : number;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private participantsService: ParticipantsService,
    private ngxService: NgxUiLoaderService,
    private tripService: TripService,
    private eventEmitterService: EventEmitterService,
    protected network: Network,
  ) { 
  }

  ngOnInit() {
    this.questions = QUESTIONS;
    this.tripService.getSelTrip().subscribe(
      (data) => {
        if(data)
          this.sel_trip = data;
        else
          this.router.navigate(["/trips"]);
      }
    );
    this.staffID = 138;
    this.participantsService.getSelParticipants().subscribe(
      (data) => {
        this.sel_participant = data;
        this.getSelDate();
      }
    )

    this.form = this.fb.group({
      q1: [false],
      q2: [false],
      q3: [false],
      q4: [false],
      q5: [false],
      q6: [false],
      q7: [false],
      q8: [false],
      agreement: [false]
    });
  }

  getSelDate(){
    this.participantsService.getSelDate().subscribe(
      (data) => {
        this.sel_date = data;
        this.getSurveys();
      }
    )
  }

  getSurveys(){
    this.participantsService.getSurveys().subscribe(
      (data) => {
        if(data){
          this.surveys = data;
          let existing = this.surveys.filter((item) => {
            return item['userID'] == this.sel_participant['userID'] && item["timestamp"] == this.sel_date && item["tripID"] == this.sel_trip['tripID']
          })
          if(existing.length > 0){
            this.existing_survey = existing[0]
            this.patchValue()
          }
        }
        else
          this.surveys = [];
      }
    )
  }

  getFullname(element){
    return element.firstname + " " + element.middlename + " " + element.lastname;
  }

  onSubmit(formData){
    this.ngxService.start();
    console.log(formData);
    let existing = this.surveys.filter((item) => {
      return item['userID'] == this.sel_participant['userID'] && item["timestamp"] == this.sel_date && item["tripID"] == this.sel_trip['tripID']
    })
    let model = {}
    if(existing.length == 0){
      model = new Survey;
    }else{
      model = existing[0];
    }
    model['tripID'] = this.sel_trip['tripID'];
    model['staffID'] = this.staffID;
    model['userID'] = this.sel_participant["userID"];
    model['timestamp'] = this.sel_date;
    model['userType'] = this.sel_participant["usertype"];
    model['q1'] = formData.q1 ? 1 : 0;
    model['q2'] = formData.q2 ? 1 : 0;
    model['q3'] = formData.q3 ? 1 : 0;
    model['q4'] = formData.q4 ? 1 : 0;
    model['q5'] = formData.q5 ? 1 : 0;
    model['q6'] = formData.q6 ? 1 : 0;
    model['q7'] = formData.q7 ? 1 : 0;
    model['q8'] = formData.q8 ? 1 : 0;
    model['accept'] = 1;
    model['isSynced'] = 0;

    let new_surveys = this.surveys.filter((item) => {
      return item['userID'] != this.sel_participant['userID'] || item["timestamp"] != this.sel_date || item["tripID"] != this.sel_trip['tripID']
    })
    new_surveys.push(model);
    this.participantsService.updateSurveys(new_surveys);
    
    if(this.network.online){
      this.eventEmitterService.onSyncButtonClick();
    }else{
      this.ngxService.stop();
      this.eventEmitterService.onUpdateButtonClick();
    }
    this.router.navigate(["/participants/" + this.sel_trip['tripID']]);
  }

  getStatusFromSurvey(survey){
    if(!this.existing_survey){
      return false;
    }
    if(this.existing_survey[survey])return true;
    return false;
  }

  patchValue(){
    this.form.patchValue({
      q1 : this.existing_survey['q1'] ? true : false,
      q2 : this.existing_survey['q2'] ? true : false,
      q3 : this.existing_survey['q3'] ? true : false,
      q4 : this.existing_survey['q4'] ? true : false,
      q5 : this.existing_survey['q5'] ? true : false,
      q6 : this.existing_survey['q6'] ? true : false,
      q7 : this.existing_survey['q7'] ? true : false,
      q8 : this.existing_survey['q8'] ? true : false,
    })
  }
}

const QUESTIONS = [
  {survey: "Fever (100.4°F or higher), or feeling feverish?", id: "q1", checked: false},
  {survey: "Chills in the last 24 hours?", id: "q2", checked: false},
  {survey: "A new cough in the last 24 hours?", id: "q3", checked: false},
  {survey: "Shortness of breath in the last 24 hours?", id: "q4", checked: true},
  {survey: "A new sore throat in the last 24 hours?", id: "q5", checked: true},
  {survey: "New muscle aches in the last 24 hours?", id: "q6", checked: false},
  {survey: "New headache in the last 24 hours?", id: "q7", checked: false},
  {survey: "New loss of smell or taste in the last 24 hours?", id: "q8", checked: false},
];
