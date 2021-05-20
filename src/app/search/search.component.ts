import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { TextsearchService } from '../app/services/textsearch.service';
import { ApiService } from '../app/services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchForm:FormGroup;
  data:any;
  a=true;
  b=false;
  c=true;
  e=false;
  d:any;
  loading=false;
  f = false;
  x = true;

  constructor(private ts:TextsearchService,private formBuilder:FormBuilder,private api:ApiService) { 
  	this.searchForm = formBuilder.group({
      name:''
    });
  }

  ngOnInit(): void {
  
  }

  handleError(err:any){
    if(err){
      console.log(err);
    }
  }

  onSubmit(){
    this.load(this.searchForm.value['name']);
    console.log(this.searchForm.value['name']);
  }

  load(input:any){
    this.loading = true;
     this.ts.getData(input).subscribe((data) =>{this.data=data;console.log(this.data);this.loading=false;},(value)=>{this.handleError(value);});
  }

  view(data){
    this.d = data;
    this.a = false;
    this.b = true;
    this.x = false;
  }

  close(){
    this.a = true;
    this.b = false;
    this.c = true;
    this.e = false;
    this.f = false;
    this.x = true;
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
