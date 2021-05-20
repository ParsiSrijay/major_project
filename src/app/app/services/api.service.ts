import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
  	headers: new HttpHeaders({ 'x-access-token': localStorage.getItem('token') })
  };

  data:any;

  constructor(private http:HttpClient) { }

  

  getMat(id){
	return this.http.get("http://127.0.0.1:5000/mat/"+id,this.httpOptions);
  }

  postComment(userid,book_name,lesson,comment){
  	this.data = {"userid":userid,"book_name":book_name,"lesson":lesson,"comment":comment}
    console.log(this.data)
  	return this.http.post("http://localhost:5000/reviews",this.data,this.httpOptions);
  }

  getComment(book){
  	return this.http.get("http://localhost:5000/reviews/"+book,this.httpOptions);
  }

  postsubscription(book,id){
    this.data = {'userid':localStorage.getItem('userid'),'book_name':book,'book_isbn':id}
    return this.http.post("http://localhost:5000/books/subscribe",this.data,this.httpOptions);
  }
}
