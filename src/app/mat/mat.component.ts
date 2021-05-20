import { Component, OnInit } from '@angular/core';
import { ApiService } from '../app/services/api.service';

@Component({
  selector: 'app-mat',
  templateUrl: './mat.component.html',
  styleUrls: ['./mat.component.css']
})
export class MatComponent implements OnInit {

  data:any;
  a = true;
  b = false;
  image:any;
  d:any;
  res:any;
  c=true;
  e=false;
  f = false;
  loading = false;

  constructor(private api:ApiService) { }

  ngOnInit(): void {
  	this.load();
  }

  handleError(err){
  	if(err){
  	console.warn('Ups error',err);
  	}
  }

  load(){
    this.loading = true;
  	this.api.getMat(localStorage.getItem('userid')).subscribe((data)=>{this.data=data;this.loading = false;},(value)=>{this.handleError(value);});
  }

  open(data){
    this.d = data;
    this.b = true;
    this.a = false;
  }

  close(){
    this.b = false;
    this.a = true;
    this.c = true;
    this.e = false;
    this.f = false;
  }

  subscribe(book,id){
    this.api.postsubscription(book,id).subscribe((result)=>{
      if(result['message']=="successfully updated"){
        this.c = false;
        this.e = true;
      }
      if(result['message']=="Already subscribed"){
        this.c = false;
        this.f = true;
      }
    },(value)=>{console.log(value);})
  }
}
