import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';


@Injectable()

export class authInterceptor implements HttpInterceptor{
    constructor(private authSrv:AuthServiceService) {
        
     }
    intercept(req : HttpRequest<any>, next : HttpHandler){
        const authToken = this.authSrv.getToken();
        const authRequest = req.clone({
            headers:req.headers.set("Authorization",authToken)
        })
        return next.handle(authRequest);
    }
}