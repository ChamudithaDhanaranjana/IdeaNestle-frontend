import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DraftService } from '../draft.service';
import { AuthService } from '../auth.service'; // Import AuthService
import { ActivatedRoute, Router } from '@angular/router';
import { ContributionService } from '../contribution.service';
import { PostService } from '../post.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogService } from '../confirmation-dialog.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateFormattingUtilService } from '../date-formatting-util.service';

interface PostData {
  id:string;
  title: string; 
  content: string; 
  categories: string[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  drafts: any[] = [];
  user: any; // Define the user object to hold profile data
  username: any;
  userId:any;
  postData: PostData;
  contributions: any[] = [];
  postsWithContributions: any;
  posts:any[] =[];
  currentPage = 0;
  currentPage2 = 1;
  totalPages = 1;
  pageNumber =0;
  itemsPerPage = 3;

  constructor(
    private authService: AuthService, 
    private draftService: DraftService, 
    private postService: PostService,
    private router: Router, 
    private route: ActivatedRoute,
    private contributionService: ContributionService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private snackBar: MatSnackBar,
    private dateFormattingUtilService: DateFormattingUtilService
    ) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe(data => {
      
      this.user = data;
      this.userId = this.user.id;
      this.username = this.user.username;
      this.getContributions(this.userId);
      this.allPosts(this.username);
      this.myPosts(this.username, this.pageNumber);
      this.draftService.getDraftsByUsername(this.username).subscribe(
        (data) => {
          this.drafts = data;
          console.info(data)
          this.drafts.forEach((draft) => {
            draft.localDate = this.dateFormattingUtilService.formatDate(draft.localDate);
          });
        },
        (error) => {
          console.error('Error fetching drafts:', error);
        }
      );
    });   
  }

  getContributions(userId: any) {
    this.contributionService.getContributionsByUserId(this.userId).subscribe(
      (data: any[]) => {
        this.contributions = data;
      },
      (error: any) => {
        console.error('Error fetching contributions:', error);
      }
    );
  }

  myPosts(username: any, pageNumber: any) {
    this.postService.getMyPostsByUsername(username, pageNumber).subscribe(
      (data: any) => { 
        console.log({ data });
        this.posts = data.content.map((item: any) => {
          return {
            id: item.id,
            title: item.title,
            content: item.content,
            localDate: this.dateFormattingUtilService.formatDate(item.localDate),
            username: item.username,  
          };
        });
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  allPosts(username: any){
    this.postService.getPostsWithContributionsByUsername(username).subscribe((data) => {
        this.postsWithContributions = data;
        console.log({data});
      })
  }

  editDraft(draft: any) {
    this.router.navigate(['/create', draft.id], {
      state: draft
    });
  }

  deleteDraft(id: string): void {
    this.confirmationDialogService.openConfirmationDialog();

    this.confirmationDialogService.getConfirmationResult().subscribe(confirmed => {
      if (confirmed) {
        if (id) {
          console.log({id})
          this.draftService.deleteDraftById(id).subscribe(
            () => {
              console.log('Draft deleted successfully');
              this.drafts = this.drafts.filter(d => d?.id !== id);
              this.cdr.checkNoChanges();
            },
            (error) => {
              console.error('Error deleting draft:', error);
            }
          );
          this.postService.deletePostById(id).subscribe(
            () => {
              console.log('post deleted successfully');
              this.posts = this.posts.filter(d => d?.id !== id);
              this.cdr.checkNoChanges();
            },
            (error) => {
              console.error('Error deleting post:', error);
            }
          );
        }
        console.log('Deleting...');
        this.showSucces();
      } else {
        
        console.log('Deletion canceled.');
      }
    });
  }
  
  deletePost(id: string): void {
    this.confirmationDialogService.openConfirmationDialog();

    this.confirmationDialogService.getConfirmationResult().subscribe(confirmed => {
      if (confirmed) {
        if (id) {
          this.postService.deletePostById(id).subscribe(
            () => {
              console.log('post deleted successfully');
              this.posts = this.posts.filter(d => d?.id !== id);
              this.cdr.checkNoChanges();
            },
            (error) => {
              console.error('Error deleting post:', error);
              this.cdr.checkNoChanges();
            }
          );
        }
        console.log('Deleting ...');
        this.showSucces();
      } else {
        
        console.log('Deletion canceled.');
      }
    });
  }

  get paginatedPostsWithContributions(): any[] {
    const startIndex = (this.currentPage2 - 1) * 4; 
    const endIndex = startIndex + 4; 
    return this.postsWithContributions.slice(startIndex, endIndex);
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.myPosts(this.username, this.currentPage);
  } 

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  goTocontribution(id: string) {
    this.router.navigate(['/contribution', id]);
  }

  get totalPages2(): number {
    return Math.ceil(this.postsWithContributions.length / this.itemsPerPage);
  }

  get paginationArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
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
}
