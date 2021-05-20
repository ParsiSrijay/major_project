import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy,OnInit} from '@angular/core';
import { NotifyService } from '../app/services/notify.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit{

  mobileQuery: MediaQueryList;
  data:any;
  a = true;
  b = false;
  c = false;
  d = false;
  e = false;
  f = false;

  fillerNav = ['Home','Search using Book Name','Search using Book Cover Image','Review A book','Check Comments for books']
  
  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private notify:NotifyService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(){
    this.countNotifications(localStorage.getItem("userid"))
  }

  shouldRun = true;

  handleError(value){
    if(value){
      console.log(value)
    }
  }

  countNotifications(id){
    this.notify.getNotificationCount(id).subscribe((data)=>{this.data=data;},(value)=>{this.handleError(value);})
  }

  open(){
      this.a = false;
      this.b = true;
      this.c = false;
      this.d = false;
      this.e = false;
      this.f = false;
  }

  show(input){
    if(input=='Home'){
      this.a = true;
      this.b = false;
      this.c = false;
      this.d = false;
      this.e = false;
      this.f = false;
    }
    if(input=='Search using Book Name'){
      this.a = false;
      this.b = false;
      this.c = true;
      this.d = false;
      this.e = false;
      this.f = false;
    }
    if(input == 'Search using Book Cover Image'){
      this.a = false;
      this.b = false;
      this.c = false;
      this.d = true;
      this.e = false;
      this.f = false;

    }
    if(input == 'Review A book'){
      this.a = false;
      this.b = false;
      this.c = false;
      this.d = false;
      this.e = true;
      this.f = false;

    }
    if(input == 'Check Comments for books'){
      this.a = false;
      this.b = false;
      this.c = false;
      this.d = false;
      this.e = false;
      this.f = true;
    }
  }
}
