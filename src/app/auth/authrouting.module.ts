import { NgModule } from '@angular/core';
import { ROUTES, Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

const routes : Routes=[
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
]


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AuthroutingModule { }
