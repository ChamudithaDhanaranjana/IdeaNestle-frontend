import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Post } from './post';
import { Contribution } from './contribution';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  
  private backendApiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  getAllPosts(pageNumber: number, firstLetter?: string) {
    let params = new HttpParams().set('page', pageNumber.toString());
    if (firstLetter) {
      params = params.set('firstLetter', firstLetter);
    }
    return this.http.get(`${this.backendApiUrl}/get/posts`, { params });
  }

  getAll(pageNumber: number): Observable<any[]> {
    const params = new HttpParams().set('page', pageNumber.toString());
    return this.http.get<any[]>(`${this.backendApiUrl}/get/all`, { params });
  }

  getPostById(id: number): Observable<Post> {
    const url = `${this.backendApiUrl}/${id}`;
    return this.http.get<Post>(url);
  }

  addComment(id: string, comment: { text: string }): Observable<any> {
    const url = `${this.backendApiUrl}/${id}/add-comment`;
    return this.http.post(url, comment);
  }

  addContribution(id: string, contribution: { content: string }): Observable<any> {
    const url = `${this.backendApiUrl}/contributions/create`;
    return this.http.post(url, contribution);
  }

  searchPosts(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendApiUrl}/search?searchTerm=${searchTerm}`);
  }

  getUserPostCount(username: string): Observable<number> {
    return this.http.get<number>(`${this.backendApiUrl}/${username}/post-count`);
  }

  getUserCommentCount(username: string): Observable<number> {
    return this.http.get<number>(`${this.backendApiUrl}/${username}/comment-count`);
  }

  createPost(postData: { title: string; content: string }): Observable<any> {
    const url = `${this.backendApiUrl}/create`;
    const headers = new HttpHeaders({
      'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE' 
    });
    return this.http.post(url, postData, { headers });
  }
  
  getPostCount(): Observable<number> {
    return this.http.get<number>(`${this.backendApiUrl}/count`, {});
  }

  getCommentCount(): Observable<number> {
    return this.http.get<number>(`${this.backendApiUrl}/comments/count`, {});
  }
  
  getContributionCount(): Observable<number> {
    return this.http.get<number>(`${this.backendApiUrl}/contributions/count`);
  }

  getPostsWithContributionsByUsername(username: string) {
    return this.http.get<any[]>(`${this.backendApiUrl}/user/${username}`);
  }

  getMyPostsByUsername(username: string, pageNumber: number) {
    const params = new HttpParams().set('page', pageNumber);
    return this.http.get(`${this.backendApiUrl}/myPosts/${username}`, { params });
  }

  deletePostById(id: string) {
    return this.http.delete<number>(`${this.backendApiUrl}/delete/post/${id}`);
  }

  updatepostById(id: string, postData: any) {
    return this.http.put(`${this.backendApiUrl}/posts/${id}`, postData);
  }

  restrictPost(postId: number): Observable<any> {
    return this.http.post(`${this.backendApiUrl}/${postId}/restrict`, {});
  }
  
  approvePost(postId: number) {
    return this.http.post(`${this.backendApiUrl}/${postId}/approve`, {});
  }

}
