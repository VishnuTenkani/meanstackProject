import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(public authService: AuthServiceService) { }

  ngOnInit() {
  }
  onSignupForm(form : NgForm){
    if(form.invalid){
      return
    }
    this.authService.createUser(form.value.email,form.value.password)

    console.log(form.value);
    
  }
}
