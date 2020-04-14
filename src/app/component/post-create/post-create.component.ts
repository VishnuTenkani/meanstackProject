import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { PostsService } from 'src/app/post-service.service';

import { Post } from '../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  providers:[FormBuilder, PostsService]
})
export class PostCreateComponent implements OnInit {
  
  enteredTitle = "";
  enteredContent = "";
  post: Post={id: "", title:"", content: ""};
  private mode = "create";
  private postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postsService.getPost(this.postId).subscribe(postData => {
          //this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
          console.log(this.post);
          
        });
      } else {
        this.mode = "create";
        this.postId = null;
        //this.post=null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
    //   this.postsService.updatePost(
    //     this.postId,
    //     form.value.title,
    //     form.value.content
    //   );
    // }
    form.resetForm();
  }
}
}
