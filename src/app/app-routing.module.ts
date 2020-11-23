import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './component/post-list/post-list.component';
import { PostCreateComponent } from './component/post-create/post-create.component';

import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth/auth.module#AuthModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
