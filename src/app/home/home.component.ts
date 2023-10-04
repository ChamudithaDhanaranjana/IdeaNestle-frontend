import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  searchTerm: string = '';
  isLoggedIn: boolean = false;
  filteredPosts: any[] = [];

  constructor(private postService: PostService, private authService: AuthService, private http: HttpClient) {}
  reloadCurrentRoute() {
    location.reload();
  }
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
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

  onFirstLetterSelected(selectedLetter: string) {
    if (selectedLetter) {
      selectedLetter = selectedLetter.toUpperCase(); 
      this.filteredPosts = this.posts.filter(post => 
        post.title.charAt(0).toUpperCase() === selectedLetter
      );
    } else {
      this.filteredPosts = this.posts;
    }
  }

}
