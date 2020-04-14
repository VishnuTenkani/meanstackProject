import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from 'src/app/post-service.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  providers:[PostsService]
})
export class PostListComponent implements OnInit {
  
  constructor(private postServ:PostsService) {
    

   }
   posts: Post[] = [];
   private postsSub: Subscription;
  ngOnInit() {
    this.postServ.getPosts();
    this.postsSub = this.postServ.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }


  onDelete(id:string){
    this.postServ.deletePost(id);

  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  


}
