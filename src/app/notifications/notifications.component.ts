import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../app/services/notify.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  data:any;
  a = true;
  count:any;
  b = false;

  constructor(private notify:NotifyService) { }

  ngOnInit(): void {
  	this.loadNotifications(localStorage.getItem('userid'));
    this.notificationCount();
  }

  handleError(err){
  	if(err){
  	console.log(err);
  	}
  }

  loadNotifications(id){
  	this.notify.getNotifications(id).subscribe((data)=>{ this.data=data;console.log(this.data); (value)=>{this.handleError(value);} })
  }

  delete(book_name){
    this.notify.deleteNotification(localStorage.getItem('userid'),book_name).subscribe((result)=>{console.log(result)},(val)=>{console.log(val)});
    this.a = false;
    this.notificationCount();  
  }

  notificationCount(){
    this.notify.getNotificationCount(localStorage.getItem('userid')).subscribe((data)=>{this.count=data;
    if(data['count']==0){
      this.b = true;
    }},(val)=>{console.log(val);})
  }

}
