import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    
    
@Injectable({    
  providedIn: 'root'    
})    
export class EventEmitterService {    
    
  invokeSyncFunction = new EventEmitter();
  invokeUpdateFunction = new EventEmitter();
  subsVar: Subscription;
  subsVar1: Subscription;
    
  constructor() { }    
    
  onSyncButtonClick() {    
    this.invokeSyncFunction.emit();    
  }
  onUpdateButtonClick() {    
    this.invokeUpdateFunction.emit();    
  }
}  