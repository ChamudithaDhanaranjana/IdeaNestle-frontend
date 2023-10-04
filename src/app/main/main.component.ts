import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DateFormattingUtilService } from '../date-formatting-util.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  posts: any[] = [];
  postId: number;

  currentPage = 0;
  totalPages = 1; 

  searchTerm: string = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dateFormattingUtilService: DateFormattingUtilService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.loadPosts(this.currentPage);
    });
  }

  loadPosts(pageNumber: number) {
    this.postService.getAllPosts(pageNumber).subscribe(
      (data: any) => {
        console.log({ data });
        this.posts = data.content.map((item: any) => {
          return {
            id: item.id,
            title: item.title,
            content: item.content,
            categories: this.transformCategories(item.categories),
            username: item.username,
            localDate: this.dateFormattingUtilService.formatDate(item.localDate)
          };
        });
        this.totalPages = data.totalPages;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  transformCategories(categories: string[]): string[] {
    return categories.map((category) => {
      switch (category) {
        case 'CATEGORY_TECHNOLOGY':
          return ' #Technology';
        case 'CATEGORY_AESTHETIC':
          return ' #Aesthetic';
        case 'CATEGORY_NEWS':
          return ' #News';
        case 'CATEGORY_NATURE':
          return ' #Nature';
        case 'CATEGORY_OTHER':
          return ' #Other';
        default:
          return category;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts(this.currentPage);
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  onFirstLetterSelected(selectedLetter: string) {
    if (selectedLetter) {
      this.searchTerm = selectedLetter;
      this.onSearch();
    } else {
      this.loadPosts(this.currentPage);
    }
  }

  onSearch() {
    if (this.searchTerm.trim() === '') {
      return;
    }
    this.posts = this.posts.filter((post: any) => {
      return (
        post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        post.categories.some((category: string) =>
          category.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    });
  }

  goToPost(id: number) {
    this.router.navigate(['/post', id]);
  }
}
