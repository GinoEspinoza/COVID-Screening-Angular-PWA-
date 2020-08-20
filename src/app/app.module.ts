import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent,ConfrimSyncDialog } from './navigation/navigation.component';
import { MaterialModule } from './material.module';


import { LoginComponent } from './login/login.component';
import { TripComponent } from './trip/trip.component';
import { ParticipantsComponent } from './participants/participants.component';
import { SurveyComponent } from './survey/survey.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {LocalAuthService } from './auth/local-auth.service';
import {AuthGuard } from './auth/auth-guard.service';
import {AccessGuard } from './auth/access-guard.service';

import {TripService } from './trip/trip.service';
import {ParticipantsService } from './participants/participants.service';

import { JwtInterceptor } from "./auth/token.interceptor"
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { PwaService } from "./pwa.service"
import { EventEmitterService } from "./event-emitter.service";
@NgModule({
  declarations: [
    NavigationComponent,
    ConfrimSyncDialog,
    LoginComponent,
    TripComponent,
    ParticipantsComponent,
    SurveyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule
    // FlexLayoutModule
  ],
  entryComponents:[ConfrimSyncDialog],
  bootstrap: [NavigationComponent],
  providers: [
    AuthGuard,
    AccessGuard,
    LocalAuthService,
    TripService,
    ParticipantsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    PwaService,
    EventEmitterService
  ]
})
export class AppModule { }
