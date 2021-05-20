import { Component, OnInit } from '@angular/core';
import { ApiService } from '../app/services/api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {

  constructor(private api:ApiService) { }

  formGroup: FormGroup;
  a = false;
  b = false;
  c = true;
  ngOnInit(): void {
  	this.initForm()
  }

  initForm(){
    this.formGroup = new FormGroup({
      bname: new FormControl('', [Validators.required]),
      lesson:new FormControl('',[Validators.required]),
      comment: new FormControl('', [Validators.required])
    });
  }

  submit(){
    if (this.formGroup.valid){
      console.log(this.formGroup.value);
      this.api.postComment(localStorage.getItem('userid'),this.formGroup.value['bname'],this.formGroup.value['lesson'],this.formGroup.value['comment']).subscribe(result => {
        console.log(result)
        if (result){
          this.a = true;
          this.c = false;
        }
        else{
          console.log("could not verify");
          this.b = true;
          this.c = false;
        }
      });
    }
  }
  	add(){
  		this.c = true;
  		this.a = false;
  		this.b = false;
  		this.initForm();
  	}
}
