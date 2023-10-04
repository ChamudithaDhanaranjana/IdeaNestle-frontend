import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { PostService } from '../post.service';
import { CategoryCount, CategoryService } from '../category.service';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchForm: FormGroup;
  userCount: number;
  postCount: number;
  commentCount: number;
  contributionCount: number;
  sumOfCommentsAndContributions: number;
  posts: any[] = [];
  postId: number;
  activeUserCount: number;
  categoryCounts: CategoryCount[] = [];
  categoryPostCounts: any[] = [];
  totalPostCount: number =0;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  paginatedUsers: any[] = [];
  currentPage = 0;
  totalPages = 1;
  pageSize = 5; 
  pages: number[] = [];
  searchUsername: any;
  
  constructor(
    private authService: AuthService, 
    private cdr: ChangeDetectorRef, 
    private postService: PostService,
    private fb: FormBuilder, 
    private categoryService: CategoryService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) {this.searchForm = this.fb.group({
      searchUsername: [''], 
    });}

  ngOnInit(): void {
    this.authService.getUserCount().subscribe(count => {
      this.userCount = count;
    });
    this.route.params.subscribe((params: { [x: string]: string | number; }) => {
      this.postId = +params['id'];
      this.loadPosts(this.currentPage);
    }); 

    this.postService.getPostCount().subscribe(count => {
      this.postCount = count;
    });
    this.postService.getCommentCount().subscribe(count => {
      this.commentCount = count;
      this.calculateSum();
    });

    this.postService.getContributionCount().subscribe(count => {
      this.contributionCount = count;
      this.calculateSum();
    });
    this.authService.getActiveUserCount().subscribe(count => {
      this.activeUserCount = count;
    });
    this.categoryService.getCategoryCounts().subscribe((data) => {
      this.categoryCounts = data;
    });
    this.authService.getAllUsers().subscribe((data) => {
      this.users = data;
      console.log('All Users:', this.users); 
      this.filteredUsers = [...this.users];
      this.initializePaginator();
    });
    this.searchForm.get('searchUsername').setValue('');
    this.fetchCategoryPostCounts();
  }

  loadPosts(pageNumber: number) {
    this.postService.getAll(pageNumber).subscribe(
      (data: any) => { 
        this.posts = data.content.map((item: any) => {
          return {
            id: item.id,
            title: item.title,
            categories: item.categories,
            username: item.username,
            status:item.status,
            localDate: item.localDate,
          };
        });
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  onSearchChange() {
    const searchTerm = this.searchUsername.toLowerCase();
  this.filteredUsers = this.users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm)
  );
  }

  private calculateSum(): void {
    if (typeof this.commentCount === 'number' && typeof this.contributionCount === 'number') {
      this.sumOfCommentsAndContributions = this.commentCount + this.contributionCount;
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }  

  goToNextPage(): void {
    const totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    if (this.currentPage < totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  updateDisplayedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  private initializePaginator(): void {
    this.currentPage = 0;
    this.updateDisplayedUsers();
  }

  onPageChange2(page: number): void {
    this.currentPage = page;
    this.updateDisplayedUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts(this.currentPage);
  } 

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  fetchCategoryPostCounts() {
    this.categoryService.getCategoryPostCounts().subscribe(
      (data) => {
        this.totalPostCount = data.reduce((total, item) => total + item.postCount, 0);
        this.categoryPostCounts = data.map((item) => ({
          ...item,
          categoryName: this.transformCategoryName(item.categoryName),
          percentage: this.calculatePercentage(item.postCount, this.totalPostCount)
        }));
      },
      (error) => {
        console.error('Error fetching category post counts:', error);
      }
    );
  }

  transformCategoryName(categoryName: string): string {
    switch (categoryName) {
      case 'CATEGORY_TECHNOLOGY':
        return 'Technology';
      case 'CATEGORY_AESTHETIC':
        return 'Aesthetic';
      case 'CATEGORY_NEWS':
        return 'News';
      case 'CATEGORY_NATURE':
        return 'Nature';
      case 'CATEGORY_OTHER':
        return 'Other';
      default:
        return categoryName;
    }
  }

  calculatePercentage(categoryCount: number, totalPostCount: number): number {
    if (totalPostCount === 0) {
      return 0;
    }
    return (categoryCount / totalPostCount) * 100;
  }

  deactivateUser(username: string) {
    this.authService.deactivateUsers(username).subscribe(
      (response) => {
        console.log('User deactivated successfully', response);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error deactivating user', error);
        this.cdr.detectChanges();
      }
    );
    this.cdr.detectChanges();
  }

  activateUser(username: string) {
    this.authService.activateUser(username).subscribe(
      (response) => {
        console.log('User activated successfully', response);
      },
      (error) => {
        console.error('Error activating user', error);
        this.cdr.detectChanges();
      }
    );
    this.cdr.detectChanges();
  }
  
  restricted(postId: number) {
    this.postService.restrictPost(postId).subscribe(
      (response) => {
        console.log('Post restricted successfully', response);
      },
      (error) => {
        console.error('Error restricting post', error);
      }
    );
    this.cdr.detectChanges();
  }

  approved(postId: number) {
    this.postService.approvePost(postId).subscribe(
      (response) => {
        console.log('Post approved successfully', response);
      },
      (error) => {
        console.error('Error approving post', error);
      }
    );
    this.cdr.detectChanges();
  }
}
