import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './component/post-list/post-list.component';
import { PostCreateComponent } from './component/post-create/post-create.component';


const routes: Routes = [
  {path:"", component:PostListComponent},
  {path:"create", component:PostCreateComponent},
  {path:"edit/:postId", component:PostCreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
