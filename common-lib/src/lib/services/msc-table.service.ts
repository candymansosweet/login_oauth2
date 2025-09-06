import { Injectable, LOCALE_ID } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MscTableService {
  storageFilter: any;
  currentUrl: any;
  url: any = '';
  subject : any = {};
  constructor(){
    fromEvent(window, 'remove-filter').subscribe((event: any) => {
      this.subject = {};
    })
  }

  setFilter(target?:string , inputFilter?:any): any {
    if(target && inputFilter){
      this.subject[target] = inputFilter;
    }
  }

  getStorageFilter() {
    return this.subject;
  }

  clearFilter(target? : string) : void {
    if(target){
      delete this.subject[target];
    }
    else {
      const event = new CustomEvent('remove-filter');
      dispatchEvent(event)
    }
  }
}

