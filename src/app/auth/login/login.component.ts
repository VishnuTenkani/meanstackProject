import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading=false;
  constructor(private authSrv:AuthServiceService) { }

  ngOnInit() {
  }
  onLoginForm(form:NgForm){
    console.log(form.value);
    if(form.invalid)
    {
      return;
    }
    this.authSrv.login(form.value.email,form.value.password)
    
  }
}
