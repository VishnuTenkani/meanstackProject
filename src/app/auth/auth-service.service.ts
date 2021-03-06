import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { authModel } from "./auth-model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment'

const apiUrl = environment.apiURL
@Injectable({
  providedIn: "root",
})
export class AuthServiceService {
  private token: string = "";
  isUserAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private isLikeValue: any;
  private userName: string;
  private authListner = new Subject<boolean>();
  constructor(private http: HttpClient, private roter: Router) { }

  createUser(email: string, password: string) {
    const authData: authModel = { email: email, password: password };
    this.http.post(apiUrl + "/user/signup", authData).subscribe(
      (Response) => {
        //console.log(Response);
        this.roter.navigate(["/auth/login"]);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  login(email: string, password: string) {
    const authData: authModel = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        likeValue: boolean;
        userName: string;
      }>(apiUrl + "/user/login", authData)
      .subscribe((Response) => {
        //console.log(Response);
        const token = Response.token;
        const expiresIntimer = Response.expiresIn;
        this.userId = Response.userId;
        this.userName = Response.userName;
        console.log(this.userName);

        if (token) {
          this.getAuthTime(expiresIntimer);
          this.token = token;
          this.isUserAuthenticated = true;
          const now = new Date();
          const expiresInDate = new Date(now.getTime() + expiresIntimer * 1000);
          this.saveAuthData(token, expiresInDate, this.userId, this.userName);
          this.authListner.next(true);
          this.roter.navigate(["/"]);
        }
      });
  }

  autoAuthUserData() {
    const authUserInfo = this.getAuthData();
    if (!authUserInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authUserInfo.expiresInDate.getTime() - now.getTime();
    this.userId = authUserInfo.userId;
    if (expiresIn > 0) {
      this.token = authUserInfo.token;
      this.isUserAuthenticated = true;
      this.getAuthTime(expiresIn / 1000);
      this.authListner.next(true);
    }
  }
  getAuth() {
    return this.isUserAuthenticated;
  }

  getAuthStatusListner() {
    return this.authListner.asObservable();
  }
  getUserId() {
    return this.userId;
  }
  getUserName() {

    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    return (this.userName = authData.userName);
  }

  getToken() {
    return this.token;
  }
  logOut() {
    this.token = null;
    this.isUserAuthenticated = false;
    this.userId = null;
    this.userName = null;
    this.authListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.roter.navigate(["/"]);
  }

  private saveAuthData(
    token: string,
    expiresInDate: Date,
    userId: string,
    userName: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiresInDate", expiresInDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
  }
  private clearAuthData() {
    localStorage.clear();
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expiresInDate = localStorage.getItem("expiresInDate");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    if (!token || !expiresInDate) {
      return;
    }
    return {
      token: token,
      expiresInDate: new Date(expiresInDate),
      userId: userId,
      userName: userName,
    };
  }
  private getAuthTime(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }
}
