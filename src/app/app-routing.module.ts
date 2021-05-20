import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotificationsComponent } from './notifications/notifications.component'; 
import { MatComponent } from './mat/mat.component';
import { SearchComponent } from './search/search.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { CommentComponent } from './comment/comment.component';
import { ImageComponent } from './image/image.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'notify',component:NotificationsComponent},
  {path:'mat',component:MatComponent},
  {path:'search',component:SearchComponent},
  {path:'reviews',component:ReviewsComponent},
  {path:'comment',component:CommentComponent},
  {path:'image',component:ImageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
