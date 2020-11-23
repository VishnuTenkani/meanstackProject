import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authSrv: AuthServiceService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const auth = this.authSrv.getAuth();
    if (!auth) {
      this.router.navigate(['/login']);
    }
    return auth;
  }
}
