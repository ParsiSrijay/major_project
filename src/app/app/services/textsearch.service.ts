import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextsearchService {

  constructor(private http:HttpClient) { }
  d:any;
  public getData(input:any){
    const url = " http://a82204d7aaad.ngrok.io/books/"+input;
    return this.http.get(url,{responseType:'json'});
  }
}
