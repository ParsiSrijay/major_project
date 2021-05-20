import { Component, OnInit } from '@angular/core';
import { ApiService } from '../app/services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  constructor(private api:ApiService) { }

  data:any;
  b = false;
  a = true;
  loading=false;
  
  ngOnInit(): void {
  	this.initForm()
  }

  formGroup: FormGroup;

  handleError(err){
  	if(err){
  	console.log(err)
  	}
  }

  initForm(){
    this.formGroup = new FormGroup({
      bname: new FormControl('', [Validators.required]),
    });
  }

  submit(){
  	this.getComments(this.formGroup.value['bname']);
  	this.a = false;
  	this.b = true;
  }

  getComments(book){
    this.loading = true;
  	this.api.getComment(book).subscribe((data)=>{this.data = data;this.loading=false;},(value)=>{this.handleError(value)})
  }
}
