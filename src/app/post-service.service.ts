import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Post } from './component/post.model';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';



@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient,private router:Router) {}

  getPosts() {
    this.http
      .get<{ message: string; post: any }>(
        "http://localhost:3000/api/posts"
      ).pipe(map((postData)=>{
        return postData.post.map(p =>{
          return{
            title:p.title,
            content:p.content,
            id:p._id
          }
        })

      }))
      .subscribe(postDataTransfermed => {
        //console.log(postDataTransfermed);
        
        this.posts = postDataTransfermed;
        this.postsUpdated.next([...this.posts]);
        //console.log(this.postsUpdated);
        
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string,image : File) {
    //const posted: Post = { id: null, title: title, content: content };
    const postDate = new FormData();
    postDate.append("title",title);
    postDate.append("content",content);
    postDate.append("image",image,title)
    this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", postDate)
      .subscribe(responseData => {
        const id = responseData.postId;
        //posted.id = id;
        //this.posts.push(posted);
        console.log(this.posts);
        this.postsUpdated.next([...this.posts])
        console.log(this.postsUpdated);
        this.router.navigate(["/"]);
      });
  }
  updatePost(postId: string, title: string, content: string) {
    const posted: Post = { id: postId, title: title, content: content };
    this.http.put("http://localhost:3000/api/posts/" + postId, posted).subscribe((respone) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id == posted.id);
      updatedPosts[oldPostIndex] = posted;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId:string){
   this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe(()=>{
     const updatedPosts = this.posts.filter(post =>post.id !== postId);
     this.posts = updatedPosts;
     this.postsUpdated.next([...this.posts])
     
   })
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }
}