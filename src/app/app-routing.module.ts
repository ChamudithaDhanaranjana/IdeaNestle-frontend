import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { SearchComponent } from './search/search.component';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { AuthGuard } from './auth.guard';
import { ContributionComponent } from './contribution/contribution.component';
const routes: Routes = [
  {
    path:'', component: HomeComponent
  },
  {
    path:'post/:id', component: PostComponent
  },
  {
    path:'signup', component: RegistrationComponent
  },
  {
    path:'login', component: LoginComponent
  },
  {
    path:'dashboard', component: DashboardComponent
  },
  {
    path:'profile', component: ProfileComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN']},
  },

  {
    path:'create', component: CreatePostComponent
  },
  { 
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] 
  },
  { path: 'create/:id', component: CreatePostComponent },
  { 
    path: 'contribution/:id', component: ContributionComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
