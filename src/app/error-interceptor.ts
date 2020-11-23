import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/operators';
import { error } from 'util';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';




@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // tslint:disable-next-line: no-shadowed-variable
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      let errorMsg = 'An unknown error occured!';
      if (error.error.message) {
        errorMsg = error.error.message;

      }
      this.dialog.open(ErrorComponent, { data: { message: errorMsg } });
      return throwError(error);
    }));
  }
}
