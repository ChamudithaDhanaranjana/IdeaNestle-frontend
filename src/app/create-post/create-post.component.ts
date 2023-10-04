import { Component, Input } from '@angular/core';
import { PostService } from '../post.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { DraftService } from '../draft.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

interface PostData {
  id:string;
  title: string; 
  content: string; 
  categories: string[]
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  postDetails: any;
  postData: PostData;
  categories = '';
  publishClicked: boolean = false;
  availableCategories: string[] = ['CATEGORY_TECHNOLOGY', 'CATEGORY_AESTHETIC', 'CATEGORY_NEWS', 'CATEGORY_NATURE', 'CATEGORY_OTHER'];
  selectedCategories: string[] = [];
  categoryLabels: { [key: string]: string } = {
    'CATEGORY_TECHNOLOGY': 'TECHNOLOGY',
    'CATEGORY_AESTHETIC': 'AESTHETIC',
    'CATEGORY_NEWS': 'NEWS',
    'CATEGORY_NATURE': 'NATURE',
    'CATEGORY_OTHER': 'OTHER',
  };

  constructor(
    private postService: PostService, 
    private draftService: DraftService,  
    private snackBar: MatSnackBar, 
    private router: Router,
    private route: ActivatedRoute) {
      if (!this.router.getCurrentNavigation()?.extras?.state) {
        this.postData = {
          categories: [],
          id: '',
          content: '',
          title: ''
        }
      } else {
        this.postData = this.router.getCurrentNavigation()?.extras?.state as PostData;
      }
    }
    toggleCategory(category: string) {
      if (this.isSelected(category)) {
        
        this.selectedCategories = this.selectedCategories.filter(c => c !== category);
      } else {
        
        this.selectedCategories.push(category);
      }
    }
  
    
    isSelected(category: string): boolean {
      return this.selectedCategories.includes(category);
    }

    ngOnInit() {
      
      this.route.params.subscribe((params) => {
        const draftId = +params['id']; 
        if (!isNaN(draftId)) {
          
          this.draftService.getDraftById(draftId).subscribe(
            (draft) => {
              if (draft) {
                this.postData = { ...draft, id: 0 }; 
              }
            },
            (error) => {
              console.error('Error fetching draft:', error);
            }
          );
        }
      });
    }
    
   
 draft() {
  this.publishClicked = false;
  this.showSucces()
  if (this.postData.id) {
    
    this.draftService.updateDraftById(this.postData.id, this.postData).subscribe(response => {
      
    }, error => {
      
    });
  } else {
    this.draftService.draftPost(this.postData).subscribe(response => {
      
    }, error => {
      
    });
  }
  this.router.navigate(['/dashboard']);
}

  publish() {
    this.publishClicked = false;
    this.postData.categories = this.selectedCategories;
    this.delete();
    this.showSucces()
    if (this.postData.id) {
      
      this.postService.updatepostById(this.postData.id, this.postData).subscribe(response => {
        
      }, error => {
        
      });
    } else {
      
      this.postService.createPost(this.postData).subscribe(response => {
        this.router.navigate(['/dashboard']);
        
      }, error => {
        
      });
    }
    this.router.navigate(['/dashboard']);
  }

  delete(){
    if (this.postData.id) {
      this.draftService.deleteDraftById(this.postData.id).subscribe(
        () => {
          console.log('Draft deleted successfully');
          
          
        },
        (error) => {
          console.error('Error deleting draft:', error);
        }
      );
    }
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

}
