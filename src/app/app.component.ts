import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './auth/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{

  constructor(private authSrv:AuthServiceService){}
  ngOnInit(){
    this.authSrv.autoAuthUserData();

  }

  
}
