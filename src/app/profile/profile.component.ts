import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Contribution } from '../contribution';
import { ContributionService } from '../contribution.service';
import { ConfirmationDialogService } from '../confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  postCount: number;
  commentCount: number;
  contributionCount: number;
  user: any; // Define the user object to hold profile data
  username: any;
  userId: any;
  updateRequest: any = {};
  updatedUser: any;
  password: any;

  constructor(
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private router: Router,
    private postService: PostService, 
    private contributionService: ContributionService,
    private confirmationDialogService: ConfirmationDialogService,
    private snackBar: MatSnackBar
    ) { }


  ngOnInit(): void {
    
    this.authService.getUserProfile().subscribe(data => {
      this.user = data;
      this.username = this.user.username;
      this.userId = this.user.id;
      this.password = this.user.password;
      this.getUserStats();
      this.getContributionCountByUserId(this.userId);
      this.updateRequest.username = this.user.username;
      this.updateRequest.password = this.user.password;
    });
    
  }

  getContributionCountByUserId(userId: any) {
    this.contributionService.getContributionCountByUserId(userId).subscribe(
      (count: number) => {
        this.contributionCount = count;
      },
      (error: any) => {
        console.error('Error fetching contribution count:', error);
      }
    );
  }

  getUserStats() {
    this.postService.getUserPostCount(this.username).subscribe(data => {
      this.postCount = data;
    });

    this.postService.getUserCommentCount(this.username).subscribe(data => {
      this.commentCount = data;
    });
    
  }

  deactivateUser(username: string): void {
    this.confirmationDialogService.openConfirmationDialog();

    this.confirmationDialogService.getConfirmationResult().subscribe(confirmed => {
      if (confirmed) {
        this.authService.deactivateUsers(username).subscribe(
          (response) => {
            console.log('User deactivated successfully', response);
          },
          (error) => {
            console.error('Error deactivating user', error);
          }
        );
        console.log('Deleting...');
        this.showSucces();
        this.logout()
      } else {
        console.log('Deletion canceled.');
      }
    });
  }
  showSucces() {
    const message = 'Delete Succesfully';
    const snackBarRef = this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    snackBarRef.instance.setMessage(message);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

}
