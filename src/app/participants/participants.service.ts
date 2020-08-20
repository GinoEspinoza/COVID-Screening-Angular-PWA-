import { Injectable } from '@angular/core';

import { ConfigService } from '../config.service';
import { ApiService } from '../api.service';

import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private dataApiUrl: string;

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    private storage: LocalStorage,
  ) {
    this.dataApiUrl = this.configService.get('DATA_API_URL');
  }

  getParticipants(tripid): Observable<any> {
    console.log('[Participants Service] Requesting timeline');

    return this.apiService.callApi(`${this.dataApiUrl}/survey/${tripid}/participants`);
  }
  syncDatas(surveys): Observable<any> {
    console.log('[Participants Service] Requesting timeline');

    return this.apiService.callApi(`${this.dataApiUrl}/survey/sync`,"POST",{ surveyResultsArray : JSON.stringify(surveys) });
  }

  addSelParticipants(participant){
    this.storage.setItem('sel_participant', participant).subscribe(() => {}, () => {});
  }
  addSelDate(date){
    this.storage.setItem('sel_date', date).subscribe(() => {}, () => {});
  }
  getSelDate(){
    return this.storage.getItem("sel_date");
  }
  getSelParticipants(){
    return this.storage.getItem("sel_participant");
  }
  getSurveys(){
    return this.storage.getItem("surveys");
  }
  updateSurveys(surveys){
    this.storage.setItem('surveys', surveys).subscribe(() => {}, () => {});
  }
  resetSurveys(surveys){
    surveys.forEach(element => {
      element.isSynced = 1;
    });
    this.storage.setItem('surveys', surveys).subscribe(() => {}, () => {});
  }
}
