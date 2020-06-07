import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { PostsService } from "src/app/post-service.service";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PageEvent, MatAccordion } from "@angular/material";
import { post } from "selenium-webdriver/http";
import { AuthServiceService } from "src/app/auth/auth-service.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
  providers: [PostsService],
})
export class PostListComponent implements OnInit {
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;
  private authListnerSubs: Subscription;
  isDisabled = false;
  @ViewChild("myaccordion", { static: true }) myPanels: MatAccordion;
  isUserAuthenticated = false;
  constructor(
    private postServ: PostsService,
    private authSrv: AuthServiceService
  ) {}
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authSrv.getUserId();
    this.postServ.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postServ.getPostUpdateListener().subscribe(
      (postsData: { posts: Post[]; maxPostCout: number }) => {
        this.isLoading = false;
        this.totalPosts = postsData.maxPostCout;
        this.posts = postsData.posts;
        // console.log(this.posts);
      },
      (err) => {
        console.log(err);
      }
    );
    this.isUserAuthenticated = this.authSrv.getAuth();
    this.authListnerSubs = this.authSrv
      .getAuthStatusListner()
      .subscribe((isAuth) => {
        this.isUserAuthenticated = isAuth;
        this.userId = this.authSrv.getUserId();
      });
  }

  onDelete(id: string) {
    this.postServ.deletePost(id).subscribe(
      () => {
        this.postServ.getPosts(this.postPerPage, this.currentPage);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangePageSize(event: PageEvent) {
    //console.log(event);
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize;

    this.postServ.getPosts(this.postPerPage, this.currentPage);
  }

  //likeActive: boolean = false;
  toggleHeartLike(id, value) {
    console.log(value);

    ///this.likeActive = !this.likeActive;
    if (!value) {
      this.addLikePost(id);
      return false;
    } else {
      this.disLikepost(id);
      return false;
    }
  }

  addLikePost(id: string) {
    this.postServ.likePost(id).subscribe(() => {
      this.postServ.getPosts(this.postPerPage, this.currentPage);
      //this.isDisabled = true;
      //console.log(this.myPanels);
    });
  }

  disLikepost(id: string) {
    this.postServ.dislikePost(id).subscribe(() => {
      this.postServ.getPosts(this.postPerPage, this.currentPage);
    });
    //this.isDisabled = true;
  }
}
