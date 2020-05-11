import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule,MatCardModule, MatToolbarModule, MatButtonModule, MatExpansionModule, MatAccordion, MatProgressSpinnerModule, MatMenuModule, MatPaginatorModule, MatDialogModule} from '@angular/material'
import { PostCreateComponent } from './component/post-create/post-create.component';
import { PostHeaderComponent } from './component/post-header/post-header.component';
import { PostListComponent } from './component/post-list/post-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { ErrorComponent } from './error/error.component';



@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostHeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatDialogModule,
    MatPaginatorModule
    

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor , multi:true,},
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor , multi:true,}
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
