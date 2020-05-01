import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from 'src/app/post-service.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material';
import { post } from 'selenium-webdriver/http';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers:[PostsService]
})
export class PostListComponent implements OnInit {
  totalPosts=0;
  postPerPage=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10]
  constructor(private postServ:PostsService) {
    

   }
   posts: Post[] = [];
   private postsSub: Subscription;
   isLoading = false;
  ngOnInit() {
    this.isLoading = true;
    this.postServ.getPosts(this.postPerPage,this.currentPage);
    this.postsSub = this.postServ.getPostUpdateListener()
      .subscribe((postsData:{posts: Post[],maxPostCout:number}) => {
        this.isLoading= false;
        this.totalPosts=postsData.maxPostCout;
        this.posts = postsData.posts;
      },err=>{
        console.log(err);
        
      });
  }


  onDelete(id:string){
    this.postServ.deletePost(id).subscribe(()=>{
      this.postServ.getPosts(this.postPerPage,this.currentPage);
    },err=>{
      console.log(err);
      
    });

  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onChangePageSize(event:PageEvent)
  {
    //console.log(event);
    this.currentPage = event.pageIndex+1;
    this.postPerPage = event.pageSize;

    this.postServ.getPosts(this.postPerPage,this.currentPage);
    
  }

  


}
