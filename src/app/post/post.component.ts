import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { AuthService } from '../auth.service';
import { ContributionService } from '../contribution.service';
import { Contribution } from '../contribution';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateFormattingUtilService } from '../date-formatting-util.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  private updateSubscription: Subscription;
  post: Post | undefined;
  commentText: string = '';
  content:any;
  contributionContent:string='';
  isLoggedIn: boolean = false;
  contributions: Contribution[] = [];
  userId: number;
  userData: any;
  localDate: any;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contributionService: ContributionService,
    private snackBar: MatSnackBar,
    private dateFormattingUtilService: DateFormattingUtilService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('id:', id);
        this.loadApprovedContributions(id);
      }
    });
    this.updateSubscription = interval(1000).subscribe(() => {
      this.refreshPost();
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  getPost(id: number) {
    this.postService.getPostById(id).subscribe(
      (data: Post) => {
        this.post = data;
        this.dateFormattingUtilService.formatDate(this.localDate)
      },
      (error) => {
        console.error('Error loading post:', error);
      }
    );
  }

  addComment() {
    const id = this.route.snapshot.params.id;
    if (id && this.commentText.trim() !== '') {
      this.postService.addComment(id, { text: this.commentText }).subscribe(
        (response) => {
          console.log('Comment added:', response);
          this.commentText = '';
          this.getPost(id); 
          this.refreshPost();
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
      this.commentText = '';
      this.showSucces();
    }
  }

  addContribution() {
    const postId = this.route.snapshot.params.id;
    const id = this.route.snapshot.params.id;
    if (postId && this.contributionContent.trim() !== '' && id) {
      const contributionData = {
        content: this.contributionContent,
        userId: id,
        postId: postId
      };
      this.postService.addContribution(postId, contributionData).subscribe(
        (response) => {
          console.log('Contribution added:', response);
          this.contributionContent = '';
          this.getPost(postId);
          this.refreshPost();
        },
        (error) => {
          console.error('Error adding contribution:', error);
        }
      );
      this.showSucces();
      this.contributionContent= '';
    }
  }
  
  loadApprovedContributions(id: any) {
    this.contributionService.getApprovedContributionsByPostId(id).subscribe(
      (data: any) => {
        console.log({data})
        this.contributions = data.map((item: any) => {
          console.log({item})
          return {
            id: item.id,
            content: item.content,
            contributor: {
              id: item?.contributor?.id,
              username: item?.contributor?.username,
              email: item?.contributor?.email
            }
          };
        });
        console.log('this.contributions: ',  this.contributions)
      },
      (error) => {
        console.error('Error loading approved contributions:', error);
      }
    );
  }
  
  refreshPost() {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.getPost(id);
    }
  }

  showSucces() {
    const message = 'Created Succesfully';
    const snackBarRef = this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    snackBarRef.instance.setMessage(message);
  }

  showError() {
    const message = 'Please fill all the fields';
    const snackBarRef = this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: { message },
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    snackBarRef.instance.setMessage(message);
  }
}
