import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthServiceService} from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  userid: any;
  a = true;
  b = false;
  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
    this.initForm();
  }
  // tslint:disable-next-line:typedef
  initForm(){
    this.formGroup = new FormGroup({
      userid: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  // tslint:disable-next-line:typedef
  loginProcess(){
    if (this.formGroup.valid){
      console.log(this.formGroup.value);
      this.authService.login(this.formGroup.value).subscribe(result => {
        console.log(result.token)
        if (result.token){
          console.log(result);
          alert(result.token);
          this.a = false;
          this.b = true;
          this.userid = this.formGroup.value.userid;
          console.log(this.formGroup.value.userid);
          localStorage.setItem("userid",this.userid);
          localStorage.setItem("token",result.token);
        }
        else{
          console.log("could not verify");
          alert("Could not login");
        }
      });
    }
  }
}
