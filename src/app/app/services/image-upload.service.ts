
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
        
  constructor(private http:HttpClient) { }
  
  url = " http://475d74f9eaa9.ngrok.io/image";

  upload(file):Observable<any> {
      const formData = new FormData(); 
      formData.append("image", file, file.name);
      return this.http.post(this.url, formData)
  }


  getImage(){
    return this.http.get(" http://475d74f9eaa9.ngrok.io/getImage",{responseType:'json'})
  }
}


