import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http:HttpClient) { }

  httpOptions = {
  	headers: new HttpHeaders({ 'x-access-token': localStorage.getItem('token') })
  };
  d:any;
  getNotifications(id){
  	const url = "http://localhost:5000/books/getNotifications/"+id;
  	return this.http.get(url,this.httpOptions)
  }

  getNotificationCount(id){
  	const url = "http://localhost:5000/books/getNotifications/"+id+"/count";
  	return this.http.get(url,this.httpOptions)
  }

  deleteNotification(userid,book_name){
    this.d = {"userid":userid,"book_name":book_name}
    const url = "http://localhost:5000/books/delNotification/"+userid+"/"+book_name;
    return this.http.delete(url,this.httpOptions);
  }
}
