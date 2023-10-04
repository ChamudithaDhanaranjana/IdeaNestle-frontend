import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    });
    this.authService.getUserProfile().subscribe((data) => {
      this.user = data;
      console.log({data})
      this.isLoggedIn = this.authService.isAuthenticated();
      if (this.isLoggedIn) {
        console.log(this.user)
        this.authService.getUserRolesById(this.user?.id || 0).subscribe(
          (roles: string[]) => {
          console.log({roles})  
            this.isAdmin = roles.indexOf('ROLE_ADMIN') !== -1;
          },
          (error) => {
            console.error('Error fetching user roles:', error);
          }
        );
        
      } else {
      }
    });
  }
  
  adminDashboardClick(): void {
    console.log('Admin dashboard button clicked');
    this.router.navigate(['/admin']);
  }

  dashboardClick(): void {
    console.log('User dashboard button clicked');
    this.router.navigate(['/dashboard']);
  }

  userIsAdmin(): boolean {
    return this.isAdmin;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
