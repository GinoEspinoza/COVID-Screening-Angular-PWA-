import { Injectable } from '@angular/core';

import { ConfigService } from '../config.service';
import { ApiService } from '../api.service';

import { Observable } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private dataApiUrl: string;

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    private storage: LocalStorage,
  ) {
    this.dataApiUrl = this.configService.get('DATA_API_URL');
  }

  getTrips(): Observable<any> {
    console.log('[Tip Service] Requesting timeline');

    return this.apiService.callApi(`${this.dataApiUrl}/survey/staff/trips`);
  }

  addSelTrip(trip){
    this.storage.setItem('sel_trip', trip).subscribe(() => {}, () => {});
  }
  getSelTrip(){
    return this.storage.getItem("sel_trip");
  }
}
