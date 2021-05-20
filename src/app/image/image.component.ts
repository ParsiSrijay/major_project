import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from '../app/services/image-upload.service';
import { ApiService } from '../app/services/api.service';
  
@Component({
    selector: 'app-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

    data:any;
    a = false;
    b = false;
    x = true;
    details:any;
    f=false;
    e =false;
    c =true;
    g = false;
  
    // Variable to store shortLink from api response
    shortLink: string = "";
    loading: boolean = false; // Flag variable
    file: File = null; // Variable to store file
  
    // Inject service 
    constructor(private fileUploadService: ImageUploadService,private api:ApiService) { }
  
    ngOnInit(): void {
    }
  
    // On file Select
    onChange(event) {
        this.file = event.target.files[0];
    }
  
    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        console.log(this.file);
        this.fileUploadService.upload(this.file).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {
  
                    // Short link via api response
                    this.shortLink = event.link;
  
                    this.loading = false; // Flag variable 
                    this.a = true;
                }
            }
        );
    }

    onView(){
        this.loading = true;
        this.fileUploadService.getImage().subscribe((data)=>{this.data=data;console.log(this.data);this.loading = false;},(value)=>{this.handleError(value);})

        this.a = false;
        this.b = true;
        this.x = false;
    }

    handleError(val){
        if(val){
            console.log(val);
        }
    }

    show(d){
        this.details = d;
        this.f = true;
        this.b = false;
        this.c = true;
        this.e = false;
        this.g = false;
    }

    close(){
        this.f = false;
        this.b = true;
    }

    subscribe(d){
        this.loading =true;
        this.api.postsubscription(d.name,d.isbn).subscribe((result)=>{
          if(result['message']=="successfully updated"){
            this.c = false;
            this.e = true;
          }
          if(result['message']=="Already subscribed"){
            this.c = false;
            this.g = true;
          }
        },(value)=>{console.log(value);})
    }

    closem(){
        this.x = true;
        this.b = false;
    }
}