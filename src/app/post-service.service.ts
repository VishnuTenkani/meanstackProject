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

  getPosts(postPerPage,currentPage) {
    let queryParam=`?pagesize=${postPerPage}&page=${currentPage}`
    this.http
      .get<{ message: string; post: any }>(
        "http://localhost:3000/api/posts" + queryParam
      ).pipe(map((postData)=>{
        return postData.post.map(p =>{
          return{
            title:p.title,
            content:p.content,
            id:p._id,
            imagePath:p.imagePath
          }
        })

      }))
      .subscribe(postDataTransfermed => {
        console.log(postDataTransfermed);
        
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
    this.http.post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postDate)
      .subscribe(responseData => {
        const post:Post={
          id: responseData.post.id,
          title:responseData.post.title,
          content:responseData.post.content,
          imagePath:responseData.post.imagePath
        } ;
        //posted.id = id;
        this.posts.push(post);
        console.log(this.posts);
        this.postsUpdated.next([...this.posts])
        console.log(this.postsUpdated);
        this.router.navigate(["/"]);
      });
  }
  updatePost(postId: string, title: string, content: string, image:File | string) {
    let posted:Post | FormData;
    if(typeof(image) === "object"){
      posted= new FormData();
      posted.append("id",postId)
      posted.append("title",title);
      posted.append("content",content);
      posted.append("image",image,title)

    }else{
       posted = { id: postId, title: title, content: content,imagePath:image };
    }
    this.http.put("http://localhost:3000/api/posts/" + postId, posted).subscribe((respone) => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id == postId);
      const post:Post={
        id: postId, title: title, content: content,imagePath:""
      }
      updatedPosts[oldPostIndex] = post;
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
    return this.http.get<{ _id: string; title: string; content: string,imagePath:string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }
}