import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.css']
})
export class PostHeaderComponent implements OnInit, AfterViewChecked, OnDestroy {
  private authListnerSubs: Subscription;
  isUserAuthenticated = false;
  userName: string = "";
  constructor(private auth: AuthServiceService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.isUserAuthenticated = this.auth.getAuth();

    this.authListnerSubs = this.auth.getAuthStatusListner().subscribe((isUserAuth) => {
      this.isUserAuthenticated = isUserAuth;
    })


  }

  onLogout() {
    this.auth.logOut();
    //this.router.navigate(["/"])
  }
  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }
  ngAfterViewChecked() {
    this.userName = this.auth.getUserName();
    this.cdr.detectChanges();
    //console.log(this.userName);

  }

}
