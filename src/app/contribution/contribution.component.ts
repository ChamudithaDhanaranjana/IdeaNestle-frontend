import { Component, OnInit } from '@angular/core';
import { ContributionService } from '../contribution.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Contribution } from '../contribution';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../confirmation-dialog.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.css']
})
export class ContributionComponent implements OnInit{
  contribution: Contribution;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private contributionService: ContributionService,
    private dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        console.log('id:', id);
        this.loadContributon(id)
      }
  });
}
loadContributon(id: string) {
  this.contributionService.getContributionById(id).subscribe(
    (data: Contribution) => {
      this.contribution = data;
    },
    (error) => {
      console.error('Error loading post:', error);
    }
  );
}
openConfirmationDialog(contributionId: string): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.deleteContribution(contributionId);
    }
    
  });
}


deleteContribution(contributionId: string): void {
  this.confirmationDialogService.openConfirmationDialog();

  this.confirmationDialogService.getConfirmationResult().subscribe(confirmed => {
    if (confirmed) {
      this.contributionService.deleteContribution(contributionId).subscribe(
        () => {
          
          console.log('Contribution deleted successfully');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          
          console.error('Failed to delete contribution:', error);
        }
      );
      console.log('Deleting contribution...');
      this.router.navigate(['/dashboard']);
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

}
