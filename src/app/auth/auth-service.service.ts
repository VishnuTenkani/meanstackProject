import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {authModel} from "./auth-model"
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
private token;
  constructor(private http:HttpClient) { }

  createUser(email : string, password : string){
      const authData : authModel ={email:email,password:password}
    this.http.post("http://localhost:3000/api/user/signup",authData).subscribe((Response)=>{
      console.log(Response);
      
    })
  }
  login(email : string, password : string){
    const authData : authModel ={email:email,password:password}
  this.http.post<{token:string}>("http://localhost:3000/api/user/login",authData).subscribe((Response)=>{
    const token = Response.token;
    this.token = token;
    
  })
}

getToken(){
  return this.token;
}
}
