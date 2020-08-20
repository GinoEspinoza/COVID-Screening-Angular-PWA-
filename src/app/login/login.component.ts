import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { LocalAuthService } from "../auth/local-auth.service"
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storage: LocalStorage,
    private authService: LocalAuthService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {

    if(localStorage.getItem('currentUser') && localStorage.getItem('token')){
      this.router.navigate(["/trips"]);
    }

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      this.ngxService.start();
      try {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        let login = await this.authService.login(username, password);
        this.ngxService.stop();
        console.log("login",login);
      } catch (err) {
        this.loginInvalid = true;
        this.ngxService.stop();
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

}
