import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {authModel} from "./auth-model"
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  private token: string = "";
  isUserAuthenticated = false;
  private tokenTimer:any;
  private userId:string;
  private authListner = new Subject<boolean>();
  constructor(private http: HttpClient, private roter: Router) {}

  createUser(email: string, password: string) {
    const authData: authModel = { email: email, password: password };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe((Response) => {
        console.log(Response);
      },err=>{
        console.log(err)
      });
  }
  login(email: string, password: string) {
    const authData: authModel = { email: email, password: password };
    this.http
      .post<{ token: string,expiresIn:number,userId:string }>("http://localhost:3000/api/user/login", authData)
      .subscribe((Response) => {
        const token = Response.token;
        const expiresIntimer= Response.expiresIn;
        this.userId = Response.userId;
        //console.log(this.userId);
        
        if (token) {
          this.getAuthTime(expiresIntimer)
          this.token = token;
          this.isUserAuthenticated = true;
          const now = new Date();
          const expiresInDate =new Date(now.getTime() + expiresIntimer * 1000)
          this.saveAuthData(token,expiresInDate,this.userId);
          this.authListner.next(true);
          this.roter.navigate(["/"]);
        }
      });
  }
  
  autoAuthUserData(){
    const authUserInfo = this.getAuthData();
    if(!authUserInfo){
      return;
    }
    const now = new Date();
    const expiresIn = authUserInfo.expiresInDate.getTime() - now.getTime();
    this.userId = authUserInfo.userId;
    if(expiresIn > 0){
      this.token = authUserInfo.token;
      this.isUserAuthenticated = true;
      this.getAuthTime(expiresIn / 1000)
      this.authListner.next(true)
    }
  }
  getAuth() {
    return this.isUserAuthenticated;
  }

  getAuthStatusListner() {
    return this.authListner.asObservable();
  }
  getUserId(){
    return this.userId;
  }

  getToken() {
    return this.token;
  }
  logOut() {
    this.token = null;
    this.isUserAuthenticated = false;
    this.userId = null;
    this.authListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.roter.navigate(["/"]);
  }

  private saveAuthData(token : string, expiresInDate : Date, userId : string){
    localStorage.setItem("token",token);
    localStorage.setItem("expiresInDate",expiresInDate.toISOString());
    localStorage.setItem("userId",userId);
  }
   private clearAuthData(){
    localStorage.clear();
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiresInDate = localStorage.getItem("expiresInDate");
    const userId = localStorage.getItem("userId");
    if(!token || !expiresInDate){
      return
    }
    return {
      token:token,
      expiresInDate:new Date(expiresInDate),
      userId:userId,
    }
  }
  private getAuthTime(duration :number){
    this.tokenTimer =  setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
}
