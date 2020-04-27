import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { PostsService } from 'src/app/post-service.service';

import { Post } from '../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import  {mimeType} from './mime-type.validators'



@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
  providers:[FormBuilder, PostsService]
})
export class PostCreateComponent implements OnInit {
  
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  private mode = "create";
  private postId: string;
  postForm:FormGroup;
  isLoading=false;
  imagePreview:any;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.postForm = new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null, {validators:[Validators.required],asyncValidators:mimeType})
    })
    this.isLoading=true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content,imagePath:postData.imagePath};
          console.log(this.post);
          this.postForm.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          })
          
        });
      } else {
        this.mode = "create";
        this.postId = null;
        this.isLoading=false;
        //this.post=null;
      }
    });
  }

  pickedImage(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image:file});
    this.postForm.get("image").updateValueAndValidity();
    const reader  = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
    

  }

  onSavePost() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.postsService.addPost(this.postForm.value.title, this.postForm.value.content,this.postForm.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content
      );
    }
    //form.resetForm();
    this.postForm.reset();
  }
}

