import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { AngularmaterialModule } from 'src/app/angularmaterial/angularmaterial.module';
import { FormsModule } from '@angular/forms';
import { AuthroutingModule } from '../authrouting.module';





@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
   ],
  imports: [
    CommonModule,
    AngularmaterialModule,
    FormsModule,
    AuthroutingModule
    
    
  ]
})
export class AuthModule { }
