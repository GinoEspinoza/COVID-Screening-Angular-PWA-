import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TripComponent } from './trip/trip.component';
import { SurveyComponent } from './survey/survey.component';

import { ParticipantsComponent } from './participants/participants.component';

import {AuthGuard } from './auth/auth-guard.service';
import {AccessGuard } from './auth/access-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TripComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'trips',
    component: TripComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'participants/:tripid',
    component: ParticipantsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'survey',
    component: SurveyComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes/*,{ useHash: true }*/)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
