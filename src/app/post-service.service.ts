import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Post } from "./component/post.model";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from '../environments/environment'

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; maxPostCout: number }>();
  apiUrl: any = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage, currentPage) {
    let queryParam = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; post: any; maxPosts: number }>(
        this.apiUrl + "/posts" + queryParam
      )
      .pipe(
        map((postData) => {
          return {
            post: postData.post.map((p) => {
              return {
                title: p.title,
                content: p.content,
                id: p._id,
                imagePath: p.imagePath,
                creator: p.creator,
                likeValue: p.likevalue,
                likesCount: p.likescount,
                creatorName: p.creatorName,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((postDataTransfermedData) => {
        console.log(postDataTransfermedData);

        this.posts = postDataTransfermedData.post;
        this.postsUpdated.next({
          posts: [...this.posts],
          maxPostCout: postDataTransfermedData.maxPosts,
        });
        //console.log(this.postsUpdated);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    //const posted: Post = { id: null, title: title, content: content };
    const postDate = new FormData();
    postDate.append("title", title);
    postDate.append("content", content);
    postDate.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        this.apiUrl + "/posts",
        postDate
      )
      .subscribe((responseData) => {
        // const post:Post={
        //   id: responseData.post.id,
        //   title:responseData.post.title,
        //   content:responseData.post.content,
        //   imagePath:responseData.post.imagePath
        // } ;
        // //posted.id = id;
        // this.posts.push(post);
        // console.log(this.posts);
        // this.postsUpdated.next([...this.posts])
        // console.log(this.postsUpdated);
        this.router.navigate(["/"]);
      });
  }
  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string,
    likesCount: number
  ) {
    let posted: Post | FormData;
    if (typeof image === "object") {
      posted = new FormData();
      posted.append("id", postId);
      posted.append("title", title);
      posted.append("content", content);
      posted.append("image", image, title);
    } else {
      posted = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        likeValue: null,
        likesCount: likesCount,
      };
    }
    this.http
      .put(this.apiUrl + "/posts" + postId, posted)
      .subscribe((respone) => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id == postId);
        // const post:Post={
        //   id: postId, title: title, content: content,imagePath:""
        // }
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts])
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(this.apiUrl + "/posts/" + postId);
    //  .subscribe(()=>{
    //  const updatedPosts = this.posts.filter(post =>post.id !== postId);
    //  this.posts = updatedPosts;
    //  this.postsUpdated.next([...this.posts])

    //})
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
      likeValue: any;
      likesCount: number;
    }>(this.apiUrl + "/posts" + id);
  }
  likePost(id: string) {
    //const post:Post={id:id,title: null, content: null,imagePath:null,creator:null,likeValue:null}
    const postId = { id: id };
    return this.http.put(this.apiUrl + "/posts", postId);
  }
  dislikePost(id: any) {
    //const post:Post={id:id,title: null, content: null,imagePath:null,creator:null,likeValue:null}
    const dispostId = { id: id };
    return this.http.put(this.apiUrl + "/dislike", dispostId);
  }
}
