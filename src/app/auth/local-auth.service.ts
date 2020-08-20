import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import * as _ from "lodash";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ConfigService } from '../config.service';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {
  private announceLoggedIn = new Subject<any>();

  loggedIn$ = this.announceLoggedIn.asObservable();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  private dataApiUrl: string;

  response:any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private localStorage: LocalStorage,
    private configService: ConfigService,
    private apiService: ApiService,
  ) { 
    this.dataApiUrl = this.configService.get('DATA_API_URL');
  }


  login(username: string, password: string) {

    let formData: FormData = new FormData();
    formData.append('password',password);
    formData.append('email',username);
    let self = this;
    this.apiService.callApi(`${this.dataApiUrl}/survey/authorize`,"POST",formData).subscribe({ 
      next(result) {
        console.log("result",result)
        if(result){
          self.setCurrentUser(result);
          self.setToken(result);
          self.router.navigate(["/trips"]);
          self.apiService.snackBar.open("Login succeed.", null, {
            duration: 4000
          });
        }else{
          self.apiService.snackBar.open("Cannot login. Please try again later.", null, {
            duration: 4000
          });
        }
      }
    })
  }

  logout(){
    this.clearToken();
    setTimeout( ()=> {
    }, 300)
  }

  currentUser(){
    let currentUser:any = localStorage.getItem('currentUser')
    if(currentUser !== undefined && currentUser !== null){
      currentUser = JSON.parse(currentUser);
    }
    return currentUser;
  }

  setCurrentUser(user){
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  setToken(user){
    localStorage.setItem('token', user.TOKEN);
  }
  clearToken(){
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.clear();
  }
}
