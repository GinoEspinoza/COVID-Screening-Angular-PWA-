import { Component, OnInit, EventEmitter } from '@angular/core';
import { LocalAuthService } from "../auth/local-auth.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Network } from '@ngx-pwa/offline';
import { ParticipantsService } from "../participants/participants.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material';
import { PwaService } from "../pwa.service"
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  
  networkStatus$
  isAuthenticated: boolean;
  surveys = [];
  login_page = false;
  n_count = 0;
  constructor(
    private authService: LocalAuthService,
    private router: Router,
    protected network: Network,
    private participantsService: ParticipantsService,
    private ngxService: NgxUiLoaderService,
    private snackBar: MatSnackBar,
    public Pwa: PwaService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private eventEmitterService: EventEmitterService
  ) {
    this.networkStatus$ = this.network.onlineChanges;
  }

  ngOnInit(){
    this.checkLoginPage()
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.invokeSyncFunction.subscribe((name:string) => {    
        this.proceedSync();
      });    
    }
    if (this.eventEmitterService.subsVar1==undefined) {    
      this.eventEmitterService.subsVar1 = this.eventEmitterService.invokeUpdateFunction.subscribe((name:string) => {    
        this.updateStorageCount();
      }); 
    }  
    this.updateStorageCount();
  }
  logout(){
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  installPwa(): void {
    this.Pwa.promptEvent.prompt();
  }
  checkLoginPage(){
    if(localStorage.getItem('token')){
      this.login_page = false;
    }else{
      this.login_page = true;
    }
    setTimeout(() => {
      this.checkLoginPage();
    }, 2000);
  }
  syncDatas(){
    const dialogRef = this.dialog.open(ConfrimSyncDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.componentInstance.onProceed.subscribe(() => {
      this.proceedSync();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("dialog closed")
    });
  }
  proceedSync(){
    this.ngxService.start();
    this.participantsService.getSurveys().subscribe(
      (data) => {
        this.surveys = data;
        let self = this;
        let unsynced = [];
        if(data){
          unsynced = data.filter((item) => {
            return item.isSynced == 0;
          })
        }
        if(unsynced.length > 0){
          this.participantsService.syncDatas(unsynced).subscribe({ 
            next(result) {
              self.ngxService.stopAll();
              console.log(result)
              if(result && result.status){
                self.participantsService.resetSurveys(self.surveys);
                // self.router.navigate(["/trips"]);
                self.snackBar.open("Data uploaded successfully!", null, {
                  duration: 5000
                });
              }
            } 
          })
        }
        else{
          this.ngxService.stopAll();
          this.snackBar.open("Nothing to sync!", null, {
            duration: 5000
          });
        }
      }
    )
  }
  updateStorageCount(){
    this.n_count = 0;
    this.participantsService.getSurveys().subscribe(
      (data) => {
        if(data){
          let unsynced = data.filter((item) => {
            return item.isSynced == 0;
          })
          this.n_count = unsynced.length
        }
      }
    )
  }
}

@Component({
  selector: 'sync-confirm-dialog',
  templateUrl: 'confirm-sync-dialog.component.html',
})
export class ConfrimSyncDialog {

  onProceed = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ConfrimSyncDialog>
  ){

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  proceed(){
    this.onProceed.emit();
  }
}