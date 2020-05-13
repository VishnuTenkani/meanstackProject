import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PostHeaderComponent } from './component/post-header/post-header.component';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';

import { ErrorComponent } from './error/error.component';
import { AngularmaterialModule } from './angularmaterial/angularmaterial.module';
import { PostModule } from './component/post/post.module';
import { AuthModule } from './auth/auth/auth.module';




@NgModule({
  declarations: [
    AppComponent,
    PostHeaderComponent,   
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularmaterialModule,
    PostModule,
    AuthModule
    
    

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor , multi:true,},
    {provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor , multi:true,}
  ],
  bootstrap: [AppComponent],
  entryComponents:[ErrorComponent]
})
export class AppModule { }
