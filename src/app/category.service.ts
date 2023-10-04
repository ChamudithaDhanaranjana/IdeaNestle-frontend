import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {}

  getCategoryCounts(): Observable<CategoryCount[]> {
    return this.http.get<CategoryCount[]>(`${this.apiUrl}/counts`);
  }
  getCategoryPostCounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/post-counts`);
  }
}

export interface CategoryCount {
  category: string;
  count: number;
}
