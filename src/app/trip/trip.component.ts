import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Trip } from "./trip";
import { TripService } from "./trip.service";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  form: FormGroup;
  trips = [];
  trips$: Observable<Trip[]>;
  isInteractionStarted: boolean = false;
  sel_trip = "";
  loading :boolean =  true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isInteractionStarted = true;
    this.trips$ = this.tripService.getTrips();

    this.loading = true;
    let self = this;
    this.trips$.subscribe({ 
      next(values) {
        self.loading = false;
        self.trips = values;
        console.log(self.trips)
      } 
    })
  }
  
  onGetParticipants(){
    if(!this.sel_trip){
      this.snackBar.open("Please select a trip", null, {
        duration: 2000
      });
    }else{
      let trips = this.trips.filter( (item) => {
        return item["tripID"] == this.sel_trip
      })
      console.log(trips);
      this.tripService.addSelTrip(trips[0]);
      this.router.navigate(["/participants/" + this.sel_trip]);
    }

  }
}
