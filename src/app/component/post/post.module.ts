import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from '../post-list/post-list.component';
import { PostCreateComponent } from '../post-create/post-create.component';
import { AngularmaterialModule } from 'src/app/angularmaterial/angularmaterial.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent],
  imports: [
    CommonModule,
    AngularmaterialModule,
    ReactiveFormsModule,
    RouterModule
    
    
  ]
})
export class PostModule { }
